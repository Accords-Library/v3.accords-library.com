import type { PayloadSDK } from "src/shared/payload/payload-sdk";
import { getLogger } from "src/utils/logger";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import {
  deserializeResponse,
  serializeResponse,
  type SerializableResponse,
} from "src/utils/responses";

const ON_DISK_ROOT = `.cache/pageCache`;
const ON_DISK_RESPONSE_CACHE_FILE = `${ON_DISK_ROOT}/responseCache.json`;
const ON_DISK_INVALIDATION_MAP_FILE = `${ON_DISK_ROOT}/invalidationMap.json`;

export class PageCache {
  private readonly logger = getLogger("[PageCache]");
  private initialized = false;

  private responseCache = new Map<string, Response>();
  private invalidationMap = new Map<string, Set<string>>();

  private scheduleSaveTimeout: NodeJS.Timeout | undefined;

  constructor(private readonly uncachedPayload: PayloadSDK) {}

  async init() {
    if (this.initialized) return;

    if (import.meta.env.ENABLE_PRECACHING === "true") {
      await this.precacheAll();
    }

    this.initialized = true;
  }

  private async precacheAll() {
    const { data: languages } = await this.uncachedPayload.getLanguages();
    const locales = languages.map(({ id }) => id);

    // Get all pages urls from CMS
    const allPagesUrls = [
      "/",
      "/settings",
      "/timeline",
      ...(await this.uncachedPayload.getFolderSlugs()).data.map((slug) => `/folders/${slug}`),
      ...(await this.uncachedPayload.getPageSlugs()).data.map((slug) => `/pages/${slug}`),
      ...(await this.uncachedPayload.getCollectibleSlugs()).data.map(
        (slug) => `/collectibles/${slug}`
      ),
    ].flatMap((url) => locales.map((id) => `/${id}${url}`));

    // Load cache from disk if available
    if (existsSync(ON_DISK_RESPONSE_CACHE_FILE) && existsSync(ON_DISK_INVALIDATION_MAP_FILE)) {
      this.logger.log("Loading cache from disk...");
      // Handle RESPONSE_CACHE_FILE
      {
        const buffer = await readFile(ON_DISK_RESPONSE_CACHE_FILE);
        const data = JSON.parse(buffer.toString()) as [string, SerializableResponse][];
        let deserializedData = data.map<[string, Response]>(([key, value]) => [
          key,
          deserializeResponse(value),
        ]);

        // Do not include cache where the key is no longer in the CMS
        deserializedData = deserializedData.filter(([key]) => allPagesUrls.includes(key));

        this.responseCache = new Map(deserializedData);
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
    }

    const cacheSizeBeforePrecaching = this.responseCache.size;

    for (const url of allPagesUrls) {
      // Do not precache response if already included in the loaded cache from disk
      if (this.responseCache.has(url)) continue;
      try {
        await fetch(`http://${import.meta.env.ASTRO_HOST}:${import.meta.env.ASTRO_PORT}${url}`);
      } catch (e) {
        this.logger.warn("Precaching failed for page", url);
      }
    }

    if (cacheSizeBeforePrecaching !== this.responseCache.size) {
      this.scheduleSave();
    }

    this.logger.log("Precaching completed!", this.responseCache.size, "responses cached");
  }

  get(url: string): Response | undefined {
    const cachedPage = this.responseCache.get(url);
    if (cachedPage) {
      this.logger.log("Retrieved cached page for", url);
      return cachedPage?.clone();
    }
    return;
  }

  set(url: string, response: Response, sdkCalls: string[]) {
    sdkCalls.forEach((id) => {
      const current = this.invalidationMap.get(id);
      if (current) {
        current.add(url);
      } else {
        this.invalidationMap.set(id, new Set([url]));
      }
    });

    this.responseCache.set(url, response.clone());
    this.logger.log("Cached response for", url);
    if (this.initialized) {
      this.scheduleSave();
    }
  }

  async invalidate(sdkUrls: string[]) {
    const pagesToInvalidate = new Set<string>();

    sdkUrls.forEach((url) => {
      const pagesForThisSDKUrl = this.invalidationMap.get(url);
      if (!pagesForThisSDKUrl) return;
      this.invalidationMap.delete(url);
      [...pagesForThisSDKUrl].forEach((page) => pagesToInvalidate.add(page));
    });

    for (const url of pagesToInvalidate) {
      this.responseCache.delete(url);
      this.logger.log("Invalidated cache for", url);
      try {
        await fetch(`http://${import.meta.env.ASTRO_HOST}:${import.meta.env.ASTRO_PORT}${url}`);
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

    const serializedResponses = await Promise.all(
      [...this.responseCache].map(async ([key, value]) => [key, await serializeResponse(value)])
    );
    const serializedResponseCache = JSON.stringify(serializedResponses);
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
