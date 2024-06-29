import type { APIRoute } from "astro";
import { contextCache, dataCache, pageCache } from "src/utils/payload";

export const GET: APIRoute = async () => {
  await dataCache.init();
  await contextCache.init();
  await pageCache.init();
  return new Response(null, { status: 200, statusText: "Ok" });
};
