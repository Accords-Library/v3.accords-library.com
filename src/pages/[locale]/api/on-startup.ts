import type { APIRoute } from "astro";
import { dataCache, pageCache } from "src/services";

export const GET: APIRoute = async () => {
  await dataCache.init();
  await pageCache.init();
  return new Response(null, { status: 200, statusText: "Ok" });
};
