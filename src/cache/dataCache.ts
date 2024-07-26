import { getLogger } from "src/utils/logger";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import type { PayloadSDK } from "src/shared/payload/sdk";
import type { EndpointChange } from "src/shared/payload/webhooks";

const ON_DISK_ROOT = `.cache/dataCache`;
const ON_DISK_RESPONSE_CACHE_FILE = `${ON_DISK_ROOT}/responseCache.json`;

export class DataCache {
  private readonly logger = getLogger("[DataCache]");
  private initialized = false;

  private readonly responseCache = new Map<string, any>();

  private scheduleSaveTimeout: NodeJS.Timeout | undefined;

  constructor(
    private readonly payload: PayloadSDK,
    private readonly uncachedPayload: PayloadSDK
  ) {}

  async init() {
    if (this.initialized) return;

    if (import.meta.env.DATA_PRECACHING === "true") {
      await this.precache();
    }

    this.initialized = true;
  }

  private async precache() {
    // Get all documents from CMS
    const allDocs = (await this.uncachedPayload.getAll()).data;

    // Load cache from disk if available
    if (existsSync(ON_DISK_RESPONSE_CACHE_FILE)) {
      this.logger.log("Loading cache from disk...");
      const buffer = await readFile(ON_DISK_RESPONSE_CACHE_FILE);
      const data = JSON.parse(buffer.toString()) as [string, any][];
      for (const [key, value] of data) {
        // Do not include cache where the key is no longer in the CMS
        if (!allDocs.find(({ url }) => url === key)) continue;
        this.set(key, value);
      }
    }

    const cacheSizeBeforePrecaching = this.responseCache.size;

    for (const doc of allDocs) {
      // Do not precache response if already included in the loaded cache from disk
      if (this.responseCache.has(doc.url)) continue;
      try {
        await this.payload.request(doc.url);
      } catch {
        this.logger.warn("Precaching failed for url", doc.url);
      }
    }

    if (cacheSizeBeforePrecaching !== this.responseCache.size) {
      this.scheduleSave();
    }

    this.logger.log("Precaching completed!", this.responseCache.size, "responses cached");
  }

  get(url: string) {
    if (import.meta.env.DATA_CACHING !== "true") return;
    const cachedResponse = this.responseCache.get(url);
    if (cachedResponse) {
      this.logger.log("Retrieved cached response for", url);
      return structuredClone(cachedResponse);
    }
  }

  set(url: string, response: any) {
    if (import.meta.env.DATA_CACHING !== "true") return;
    this.responseCache.set(url, response);
    this.logger.log("Cached response for", url);
    if (this.initialized) {
      this.scheduleSave();
    }
  }

  async invalidate(changes: EndpointChange[]) {
    if (import.meta.env.DATA_CACHING !== "true") return;

    const urls = changes.map(({ url }) => url);
    for (const url of urls) {
      this.responseCache.delete(url);
      this.logger.log("Invalidated cache for", url);
      try {
        await this.payload.request(url);
      } catch (e) {
        this.logger.log("Revalidation fails for", url);
      }
    }
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
