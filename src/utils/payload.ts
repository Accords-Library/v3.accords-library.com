import {
  type Language,
  type EndpointWording,
  type EndpointWebsiteConfig,
} from "src/shared/payload/payload-sdk";
import { getPayloadSDK } from "src/shared/payload/payload-sdk";

let token: string | undefined = undefined;
let expiration: number | undefined = undefined;

const responseCache = new Map<string, any>();

export const payload = getPayloadSDK({
  apiURL: import.meta.env.PAYLOAD_API_URL,
  email: import.meta.env.PAYLOAD_USER,
  password: import.meta.env.PAYLOAD_PASSWORD,
  tokenCache: {
    get: () => {
      if (!token) return undefined;
      if (!expiration || expiration < Date.now()) {
        console.log("[PayloadSDK] No token to be retrieved or the token expired");
        return undefined;
      }
      const diffInMinutes = Math.floor((expiration - Date.now()) / 1000 / 60);
      console.log("[PayloadSDK] Retrieved token from cache. TTL is", diffInMinutes, "minutes.");
      return token;
    },
    set: (newToken, newExpiration) => {
      token = newToken;
      expiration = newExpiration * 1000;
      const diffInMinutes = Math.floor((expiration - Date.now()) / 1000 / 60);
      console.log("[PayloadSDK] New token set. TTL is", diffInMinutes, "minutes.");
    },
  },
  responseCache: {
    get: (url) => {
      const cachedResponse = responseCache.get(url);
      if (!cachedResponse) {
        console.log("[ResponseCaching] No cached response found for", url);
        return undefined;
      }
      console.log("[ResponseCaching] Retrieved cache response for", url);
      return cachedResponse;
    },
    set: (url, response) => {
      console.log("[ResponseCaching] Caching response for", url);
      responseCache.set(url, response);
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
  locales: (await payload.getLanguages()).data,
  currencies: (await payload.getCurrencies()).data.map(({ id }) => id),
  wordings: (await payload.getWordings()).data,
  config: (await payload.getConfig()).data,
});

export let cache = await fetchNewData();

export const refreshWordings = async () => {
  cache.wordings = (await payload.getWordings()).data;
};

export const refreshCurrencies = async () => {
  cache.currencies = (await payload.getCurrencies()).data.map(({ id }) => id);
};

export const refreshLocales = async () => {
  cache.locales = (await payload.getLanguages()).data;
};

export const refreshWebsiteConfig = async () => {
  cache.config = (await payload.getConfig()).data;
};
