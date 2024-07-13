import type {
  EndpointLanguage,
  EndpointWebsiteConfig,
  EndpointWording,
} from "src/shared/payload/endpoint-types";
import type { PayloadSDK } from "src/shared/payload/sdk";
import { getLogger } from "src/utils/logger";

export class ContextCache {
  private initialized = false;
  private logger = getLogger("[ContextCache]");

  constructor(private readonly payload: PayloadSDK) {}

  languages: EndpointLanguage[] = [];
  locales: string[] = [];
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
    this.wordings = (await this.payload.getWordings()).data;
    this.logger.log("Wordings refreshed");
  }

  async refreshCurrencies() {
    this.currencies = (await this.payload.getCurrencies()).data.map(({ id }) => id);
    this.logger.log("Currencies refreshed");
  }

  async refreshLocales() {
    this.languages = (await this.payload.getLanguages()).data;
    this.locales = this.languages.filter(({ selectable }) => selectable).map(({ id }) => id);
    this.logger.log("Locales refreshed");
  }

  async refreshWebsiteConfig() {
    this.config = (await this.payload.getConfig()).data;
    this.logger.log("WebsiteConfig refreshed");
  }
}
