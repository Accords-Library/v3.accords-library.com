import type { PayloadSDK } from "src/shared/payload/payload-sdk";
import { getLogger } from "src/utils/logger";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";

const ON_DISK_ROOT = `.cache/dataCache`;
const ON_DISK_RESPONSE_CACHE_FILE = `${ON_DISK_ROOT}/responseCache.json`;

export class DataCache {
  private readonly logger = getLogger("[DataCache]");
  private initialized = false;

  private readonly responseCache = new Map<string, any>();
  private readonly invalidationMap = new Map<string, Set<string>>();

  private scheduleSaveTimeout: NodeJS.Timeout | undefined;

  constructor(
    private readonly payload: PayloadSDK,
    private readonly uncachedPayload: PayloadSDK,
    private readonly onInvalidate: (urls: string[]) => Promise<void>
  ) {}

  async init() {
    if (this.initialized) return;

    if (import.meta.env.ENABLE_PRECACHING === "true") {
      await this.precache();
    }

    this.initialized = true;
  }

  private async precache() {
    // Get all keys from CMS
    const allSDKUrls = (await this.uncachedPayload.getAllSdkUrls()).data.urls;

    // Load cache from disk if available
    if (existsSync(ON_DISK_RESPONSE_CACHE_FILE)) {
      this.logger.log("Loading cache from disk...");
      const buffer = await readFile(ON_DISK_RESPONSE_CACHE_FILE);
      const data = JSON.parse(buffer.toString()) as [string, any][];
      for (const [key, value] of data) {
        // Do not include cache where the key is no longer in the CMS
        if (!allSDKUrls.includes(key)) continue;
        this.set(key, value);
      }
    }

    const cacheSizeBeforePrecaching = this.responseCache.size;

    for (const url of allSDKUrls) {
      // Do not precache response if already included in the loaded cache from disk
      if (this.responseCache.has(url)) continue;
      try {
        await this.payload.request(url);
      } catch {
        this.logger.warn("Precaching failed for url", url);
      }
    }

    if (cacheSizeBeforePrecaching !== this.responseCache.size) {
      this.scheduleSave();
    }

    this.logger.log("Precaching completed!", this.responseCache.size, "responses cached");
  }

  get(url: string) {
    const cachedResponse = this.responseCache.get(url);
    if (cachedResponse) {
      this.logger.log("Retrieved cached response for", url);
      return structuredClone(cachedResponse);
    }
  }

  set(url: string, response: any) {
    const stringData = JSON.stringify(response);
    const regex = /[a-f0-9]{24}/g;
    const ids = [...stringData.matchAll(regex)].map((match) => match[0]);
    const uniqueIds = [...new Set(ids)];

    uniqueIds.forEach((id) => {
      const current = this.invalidationMap.get(id);
      if (current) {
        current.add(url);
      } else {
        this.invalidationMap.set(id, new Set([url]));
      }
    });

    this.responseCache.set(url, response);
    this.logger.log("Cached response for", url);
    if (this.initialized) {
      this.scheduleSave();
    }
  }

  async invalidate(ids: string[], urls: string[]) {
    const urlsToInvalidate = new Set<string>(urls);

    ids.forEach((id) => {
      const urlsForThisId = this.invalidationMap.get(id);
      if (!urlsForThisId) return;
      this.invalidationMap.delete(id);
      [...urlsForThisId].forEach((url) => urlsToInvalidate.add(url));
    });

    for (const url of urlsToInvalidate) {
      this.responseCache.delete(url);
      this.logger.log("Invalidated cache for", url);
      try {
        await this.payload.request(url);
      } catch (e) {
        this.logger.log("Revalidation fails for", url);
      }
    }

    this.onInvalidate([...urlsToInvalidate]);
    this.logger.log("There are currently", this.responseCache.size, "responses in cache.");
    if (this.initialized) {
      this.scheduleSave();
    }
  }

  private scheduleSave() {
    if (this.scheduleSaveTimeout) {
      clearTimeout(this.scheduleSaveTimeout);
    }
    this.scheduleSaveTimeout = setTimeout(() => {
      this.save();
    }, 10_000);
  }

  private async save() {
    if (!existsSync(ON_DISK_ROOT)) {
      await mkdir(ON_DISK_ROOT, { recursive: true });
    }

    const serializedResponseCache = JSON.stringify([...this.responseCache]);
    await writeFile(ON_DISK_RESPONSE_CACHE_FILE, serializedResponseCache, {
      encoding: "utf-8",
    });
    this.logger.log("Saved", ON_DISK_RESPONSE_CACHE_FILE);
  }
}
