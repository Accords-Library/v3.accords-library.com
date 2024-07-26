import type { APIRoute } from "astro";
import { contextCache, dataCache, pageCache } from "src/services";

export const GET: APIRoute = async ({ locals }) => {
  locals.pageCaching = false;

  await contextCache.init();
  await dataCache.init();
  await pageCache.init();
  return new Response(null, { status: 200, statusText: "Ok" });
};
