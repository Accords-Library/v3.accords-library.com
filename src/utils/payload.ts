import {
  type Language,
  type EndpointWording,
  type EndpointWebsiteConfig,
} from "src/shared/payload/payload-sdk";
import { getPayloadSDK } from "src/shared/payload/payload-sdk";

let token: string | undefined = undefined;
let expiration: number | undefined = undefined;

const responseCache = new Map<string, any>();
const idsCacheMap = new Map<string, Set<string>>();

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
      if (cachedResponse) {
        console.log("[ResponseCaching] Retrieved cache response for", url);
        return cachedResponse;
      }
    },
    set: (url, response) => {
      const stringData = JSON.stringify(response);
      const regex = /[a-f0-9]{24}/g;
      const ids = [...stringData.matchAll(regex)].map((match) => match[0]);
      const uniqueIds = [...new Set(ids)];

      uniqueIds.forEach((id) => {
        const current = idsCacheMap.get(id);
        if (current) {
          current.add(url);
        } else {
          idsCacheMap.set(id, new Set([url]));
        }
      });

      console.log("[ResponseCaching] Caching response for", url);
      responseCache.set(url, response);
    },
  },
});

export const invalidateDataCache = async (id: string) => {
  const responsesToInvalidate = idsCacheMap.get(id);
  if (!responsesToInvalidate) return;
  idsCacheMap.delete(id);

  for (const url of responsesToInvalidate) {
    responseCache.delete(url);
    try {
      await payload.request(url);
      console.log("[ResponseCaching][Invalidation] Success for", url);
    } catch (e) {
      console.log("[ResponseCaching][Invalidation] Failure for", url);
    }
  }

  console.log("[ResponseCaching] There are currently", responseCache.size, "responses in cache.");
};

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

let payloadInitialized = false;
export const initPayload = async () => {
  if (!payloadInitialized) {
    const result = await payload.getAllPaths();

    for (const slug of result.pages) {
      await payload.getPage(slug);
    }

    for (const slug of result.folders) {
      await payload.getFolder(slug);
    }

    for (const slug of result.collectibles) {
      const collectible = await payload.getCollectible(slug);
      if (collectible.scans) {
        await payload.getCollectibleScans(slug);
      }
      if (collectible.gallery) {
        await payload.getCollectibleGallery(slug);
      }
    }

    for (const id of result.recorders) {
      await payload.getRecorderByID(id);
    }

    for (const id of result.recorders) {
      await payload.getRecorderByID(id);
    }

    for (const id of result.audios) {
      await payload.getAudioByID(id);
    }

    for (const id of result.videos) {
      await payload.getVideoByID(id);
    }

    for (const id of result.images) {
      await payload.getImageByID(id);
    }

    await payload.getChronologyEvents();

    payloadInitialized = true;
    console.log("[ResponseCaching] Precaching completed!", responseCache.size, "responses cached");
  }
};
