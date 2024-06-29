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

  constructor(private readonly payload: PayloadSDK) {}

  async init() {
    if (this.initialized) return;

    if (import.meta.env.ENABLE_PRECACHING === "true") {
      await this.precacheAll();
    }

    this.initialized = true;
  }

  private async precacheAll() {
    if (existsSync(ON_DISK_RESPONSE_CACHE_FILE) && existsSync(ON_DISK_INVALIDATION_MAP_FILE)) {
      this.logger.log("Loading cache from disk...");
      // Handle RESPONSE_CACHE_FILE
      {
        const buffer = await readFile(ON_DISK_RESPONSE_CACHE_FILE);
        const data = JSON.parse(buffer.toString()) as [string, SerializableResponse][];
        const deserializedData = data.map<[string, Response]>(([key, value]) => [
          key,
          deserializeResponse(value),
        ]);
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
    } else {
      const { data: languages } = await this.payload.getLanguages();
      const locales = languages.map(({ id }) => id);

      await this.precache("/", locales);
      await this.precache("/settings", locales);
      await this.precache("/timeline", locales);

      const { data: folders } = await this.payload.getFolderSlugs();
      for (const slug of folders) {
        await this.precache(`/folders/${slug}`, locales);
      }

      const { data: pages } = await this.payload.getPageSlugs();
      for (const slug of pages) {
        await this.precache(`/pages/${slug}`, locales);
      }

      const { data: collectibles } = await this.payload.getCollectibleSlugs();
      for (const slug of collectibles) {
        await this.precache(`/collectibles/${slug}`, locales);
      }

      await this.save();
    }

    this.logger.log("Precaching completed!", this.responseCache.size, "responses cached");
  }

  private async precache(pathname: string, locales: string[]) {
    try {
      await Promise.all(
        locales.map((locale) => {
          const url = `http://${import.meta.env.ASTRO_HOST}:${import.meta.env.ASTRO_PORT}/${locale}${pathname}`;
          return fetch(url);
        })
      );
    } catch (e) {
      this.logger.warn("Precaching failed for page", pathname);
    }
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
      this.save();
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
      this.save();
    }
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
