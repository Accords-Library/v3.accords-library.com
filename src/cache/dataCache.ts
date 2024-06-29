import type { PayloadSDK } from "src/shared/payload/payload-sdk";
import { getLogger } from "src/utils/logger";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";

const ON_DISK_ROOT = `.cache/dataCache`;
const ON_DISK_RESPONSE_CACHE_FILE = `${ON_DISK_ROOT}/responseCache.json`;
const ON_DISK_INVALIDATION_MAP_FILE = `${ON_DISK_ROOT}/invalidationMap.json`;

export class DataCache {
  private readonly logger = getLogger("[DataCache]");
  private initialized = false;

  private responseCache = new Map<string, any>();
  private invalidationMap = new Map<string, Set<string>>();

  constructor(
    private readonly payload: PayloadSDK,
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
    if (existsSync(ON_DISK_RESPONSE_CACHE_FILE) && existsSync(ON_DISK_INVALIDATION_MAP_FILE)) {
      this.logger.log("Loading cache from disk...");
      // Handle RESPONSE_CACHE_FILE
      {
        const buffer = await readFile(ON_DISK_RESPONSE_CACHE_FILE);
        const data = JSON.parse(buffer.toString());
        this.responseCache = new Map(data);
      }

      // Handle INVALIDATION_MAP_FILE
      {
        const buffer = await readFile(ON_DISK_INVALIDATION_MAP_FILE);
        const data = JSON.parse(buffer.toString()) as [string, string[]][];
        const deserialize = data.map<[string, Set<string>]>(([key, value]) => [
          key,
          new Set(value),
        ]);
        this.invalidationMap = new Map(deserialize);
      }
    } else {
      const { data } = await this.payload.getAllSdkUrls();

      for (const url of data.urls) {
        try {
          await this.payload.request(url);
        } catch {
          this.logger.warn("Precaching failed for url", url);
        }
      }

      await this.save();
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
      this.save();
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
      this.save();
    }
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

    const serializedIdsCache = JSON.stringify(
      [...this.invalidationMap].map(([key, value]) => [key, [...value]])
    );
    await writeFile(ON_DISK_INVALIDATION_MAP_FILE, serializedIdsCache, {
      encoding: "utf-8",
    });
    this.logger.log("Saved", ON_DISK_INVALIDATION_MAP_FILE);
  }
}
