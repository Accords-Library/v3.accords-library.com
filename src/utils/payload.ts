import {
  type Language,
  type EndpointWording,
  type EndpointWebsiteConfig,
} from "src/shared/payload/payload-sdk";
import { getPayloadSDK } from "src/shared/payload/payload-sdk";

let token: string | undefined = undefined;
let expiration: number | undefined = undefined;

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
