import { ContextCache } from "src/cache/contextCache";
import { DataCache } from "src/cache/dataCache";
import { PageCache } from "src/cache/pageCache";
import { TokenCache } from "src/cache/tokenCache";
import { PayloadSDK } from "src/shared/payload/sdk";

const tokenCache = new TokenCache();

const payload = new PayloadSDK(
  import.meta.env.PAYLOAD_API_URL,
  import.meta.env.PAYLOAD_USER,
  import.meta.env.PAYLOAD_PASSWORD
);
payload.addTokenCache(tokenCache);

const uncachedPayload = new PayloadSDK(
  import.meta.env.PAYLOAD_API_URL,
  import.meta.env.PAYLOAD_USER,
  import.meta.env.PAYLOAD_PASSWORD
);
uncachedPayload.addTokenCache(tokenCache);
const pageCache = new PageCache(uncachedPayload);

// Loading context cache first so that the server can still serve responses while precaching.
const contextCache = new ContextCache(payload);
await contextCache.init();

const dataCache = new DataCache(payload, uncachedPayload, (urls) => pageCache.invalidate(urls));
payload.addDataCache(dataCache);

export { payload, contextCache, pageCache, dataCache };
