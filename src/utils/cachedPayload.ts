import {
  payload,
  type Language,
  type EndpointWording,
  type EndpointWebsiteConfig,
} from "src/shared/payload/payload-sdk";

type Cache = {
  locales: Language[];
  currencies: string[];
  wordings: EndpointWording[];
  config: EndpointWebsiteConfig;
};

const fetchNewData = async (): Promise<Cache> => ({
  locales: await payload.getLanguages(),
  currencies: (await payload.getCurrencies()).map(({ id }) => id),
  wordings: await payload.getWordings(),
  config: await payload.getConfig(),
});

export let cache = await fetchNewData();

export const refreshWordings = async () => {
  cache.wordings = await payload.getWordings();
};

export const refreshCurrencies = async () => {
  cache.currencies = (await payload.getCurrencies()).map(({ id }) => id);
};

export const refreshLocales = async () => {
  cache.locales = await payload.getLanguages();
};

export const refreshWebsiteConfig = async () => {
  cache.config = await payload.getConfig();
};
