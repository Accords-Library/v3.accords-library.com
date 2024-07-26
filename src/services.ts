import { AnalyticsSDK } from "src/shared/analytics/sdk";
import { MeilisearchSDK } from "src/shared/meilisearch/sdk";
import { ContextCache } from "src/cache/contextCache";
import { DataCache } from "src/cache/dataCache";
import { PageCache } from "src/cache/pageCache";
import { TokenCache } from "src/cache/tokenCache";
import { PayloadSDK } from "src/shared/payload/sdk";

export const meilisearch = new MeilisearchSDK(
  import.meta.env.MEILISEARCH_URL,
  import.meta.env.MEILISEARCH_MASTER_KEY
);

const mockedAnalytics = {
  trackRequest: () => {},
  trackEvent: () => {},
};

export const analytics = import.meta.env.ANALYTICS_URL
  ? new AnalyticsSDK(import.meta.env.ANALYTICS_URL)
  : mockedAnalytics;

const tokenCache = new TokenCache();

const uncachedPayload = new PayloadSDK(
  import.meta.env.PAYLOAD_API_URL,
  import.meta.env.PAYLOAD_USER,
  import.meta.env.PAYLOAD_PASSWORD
);
uncachedPayload.addTokenCache(tokenCache);

export const payload = new PayloadSDK(
  import.meta.env.PAYLOAD_API_URL,
  import.meta.env.PAYLOAD_USER,
  import.meta.env.PAYLOAD_PASSWORD
);
payload.addTokenCache(tokenCache);

// Loading context cache first so that the server can still serve responses while precaching.
export const contextCache = new ContextCache(payload);
await contextCache.init();

export const dataCache = new DataCache(payload, uncachedPayload);
payload.addDataCache(dataCache);

export const pageCache = new PageCache(uncachedPayload, contextCache);
