import { getLogger } from "src/utils/logger";

class PageCache {
  private readonly logger = getLogger("[PageCache]");
  private readonly cache = new Map<string, Response>();

  get(url: string): Response | undefined {
    const cachedPage = this.cache.get(url);
    if (cachedPage) {
      this.logger.log("Retrieved cached page for", url);
      return cachedPage?.clone();
    }
    return;
  }

  set(url: string, response: Response) {
    this.cache.set(url, response.clone());
    this.logger.log("Cached response for", url);
  }
}

export const pageCache = new PageCache();
