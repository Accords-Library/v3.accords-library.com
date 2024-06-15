import {
  type Language,
  type EndpointWording,
  type EndpointWebsiteConfig,
} from "src/shared/payload/payload-sdk";
import { getPayloadSDK } from "src/shared/payload/payload-sdk";
import NodeCache from "node-cache";

const REFRESH_FREQUENCY_IN_SEC = 60;
const nodeCache = new NodeCache({
  checkperiod: REFRESH_FREQUENCY_IN_SEC,
  deleteOnExpire: true,
  forceString: true,
  maxKeys: 1,
});
const TOKEN_KEY = "token";

export const payload = getPayloadSDK({
  apiURL: import.meta.env.PAYLOAD_API_URL,
  email: import.meta.env.PAYLOAD_USER,
  password: import.meta.env.PAYLOAD_PASSWORD,
  tokenCache: {
    get: () => {
      const cachedToken = nodeCache.get<string>(TOKEN_KEY);
      if (cachedToken !== undefined) {
        const cachedTokenTtl = nodeCache.getTtl(TOKEN_KEY) as number;
        const diffInMinutes = Math.floor((cachedTokenTtl - Date.now()) / 1000 / 60);
        console.log("Retrieved token from cache. TTL is", diffInMinutes, "minutes.");
        return cachedToken;
      }
      console.log("No token to be retrieved or the token expired");
      return undefined;
    },
    set: (token, exp) => {
      const now = Math.floor(Date.now() / 1000);
      const ttl = Math.floor(exp - now - REFRESH_FREQUENCY_IN_SEC * 2);
      const ttlInMinutes = Math.floor(ttl / 60);
      console.log("Token was refreshed. TTL is", ttlInMinutes, "minutes.");
      nodeCache.set(TOKEN_KEY, token, ttl);
    },
  },
});

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
