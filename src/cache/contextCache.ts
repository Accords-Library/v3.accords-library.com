import type {
  EndpointWebsiteConfig,
  EndpointWording,
  Language,
} from "src/shared/payload/payload-sdk";
import { getLogger } from "src/utils/logger";
import { payload } from "src/utils/payload";

class ContextCache {
  private initialized = false;
  private logger = getLogger("[ContextCache]");

  locales: Language[] = [];
  currencies: string[] = [];
  wordings: EndpointWording[] = [];
  config: EndpointWebsiteConfig = {
    home: { folders: [] },
    timeline: { breaks: [], eras: [], eventCount: 0 },
  };

  async init() {
    if (this.initialized) return;
    await this.refreshAll();
    this.initialized = true;
    this.logger.log("Init complete");
  }

  private async refreshAll() {
    await this.refreshCurrencies();
    await this.refreshLocales();
    await this.refreshWebsiteConfig();
    await this.refreshWordings();
  }

  async refreshWordings() {
    this.wordings = await payload.getWordings();
    this.logger.log("Wordings refreshed");
  }

  async refreshCurrencies() {
    contextCache.currencies = (await payload.getCurrencies()).map(({ id }) => id);
    this.logger.log("Currencies refreshed");
  }

  async refreshLocales() {
    contextCache.locales = await payload.getLanguages();
    this.logger.log("Locales refreshed");
  }

  async refreshWebsiteConfig() {
    contextCache.config = await payload.getConfig();
    this.logger.log("WebsiteConfig refreshed");
  }
}

const contextCache = new ContextCache();
await contextCache.init();
export { contextCache };
