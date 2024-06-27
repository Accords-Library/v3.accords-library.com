import { getLogger } from "src/utils/logger";
import { payload } from "src/utils/payload";

class DataCache {
  private readonly logger = getLogger("[DataCache]");
  private initialized = false;

  private readonly responseCache = new Map<string, any>();
  private readonly idsCacheMap = new Map<string, Set<string>>();

  async init() {
    if (this.initialized) return;

    if (import.meta.env.ENABLE_PRECACHING === "true") {
      await this.precache();
    }

    this.initialized = true;
  }

  private async precache() {
    const { urls } = await payload.getAllSdkUrls();
    for (const url of urls) {
      try {
        await payload.request(url);
      } catch {
        this.logger.warn("Precaching failed for url", url);
      }
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
      const current = this.idsCacheMap.get(id);
      if (current) {
        current.add(url);
      } else {
        this.idsCacheMap.set(id, new Set([url]));
      }
    });

    this.responseCache.set(url, response);
    this.logger.log("Cached response for", url);
  }

  async invalidate(ids: string[], urls: string[]) {
    const urlsToInvalidate = new Set<string>(urls);

    ids.forEach((id) => {
      const urlsForThisId = this.idsCacheMap.get(id);
      if (!urlsForThisId) return;
      this.idsCacheMap.delete(id);
      [...urlsForThisId].forEach((url) => urlsToInvalidate.add(url));
    });

    for (const url of urlsToInvalidate) {
      this.responseCache.delete(url);
      this.logger.log("Invalidated cache for", url);
      try {
        await payload.request(url);
      } catch (e) {
        this.logger.log("Revalidation fails for", url);
      }
    }

    this.logger.log("There are currently", this.responseCache.size, "responses in cache.");
  }
}

export const dataCache = new DataCache();
