import type {
  EndpointLanguage,
  EndpointWebsiteConfig,
  EndpointWording,
} from "src/shared/payload/endpoint-types";
import { SDKEndpointNames, type PayloadSDK } from "src/shared/payload/sdk";
import type { EndpointChange } from "src/shared/payload/webhooks";
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

  async invalidate(changes: EndpointChange[]) {
    for (const change of changes) {
      switch (change.type) {
        case SDKEndpointNames.getWordings:
          return await this.refreshWordings();

        case SDKEndpointNames.getLanguages:
          return await this.refreshLocales();

        case SDKEndpointNames.getCurrencies:
          return await this.refreshCurrencies();

        case SDKEndpointNames.getWebsiteConfig:
          return await this.refreshWebsiteConfig();
      }
    }
  }

  private async refreshWordings() {
    this.wordings = (await this.payload.getWordings()).data;
    this.logger.log("Wordings refreshed");
  }

  private async refreshCurrencies() {
    this.currencies = (await this.payload.getCurrencies()).data.map(({ id }) => id);
    this.logger.log("Currencies refreshed");
  }

  private async refreshLocales() {
    this.languages = (await this.payload.getLanguages()).data;
    this.locales = this.languages.filter(({ selectable }) => selectable).map(({ id }) => id);
    this.logger.log("Locales refreshed");
  }

  private async refreshWebsiteConfig() {
    this.config = (await this.payload.getWebsiteConfig()).data;
    this.logger.log("WebsiteConfig refreshed");
  }
}
