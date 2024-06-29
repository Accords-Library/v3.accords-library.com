import type { PayloadSDK } from "src/shared/payload/payload-sdk";
import { getLogger } from "src/utils/logger";

export class PageCache {
  private readonly logger = getLogger("[PageCache]");
  private initialized = false;

  private readonly responseCache = new Map<string, Response>();
  private readonly invalidationMap = new Map<string, Set<string>>();

  constructor(private readonly payload: PayloadSDK) {}

  async init() {
    if (this.initialized) return;

    if (import.meta.env.ENABLE_PRECACHING === "true") {
      await this.precacheAll();
    }

    this.initialized = true;
  }

  private async precacheAll() {
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
  }
}
