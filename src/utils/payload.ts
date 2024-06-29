import { ContextCache } from "src/cache/contextCache";
import { DataCache } from "src/cache/dataCache";
import { PageCache } from "src/cache/pageCache";
import { TokenCache } from "src/cache/tokenCache";
import { PayloadSDK } from "src/shared/payload/payload-sdk";

const payload = new PayloadSDK(
  import.meta.env.PAYLOAD_API_URL,
  import.meta.env.PAYLOAD_USER,
  import.meta.env.PAYLOAD_PASSWORD
);

const contextCache = new ContextCache(payload);
const pageCache = new PageCache(payload);
const dataCache = new DataCache(payload, (urls) => pageCache.invalidate(urls));

payload.addTokenCache(new TokenCache());
payload.addDataCache(dataCache);

export { payload, contextCache, pageCache, dataCache };
