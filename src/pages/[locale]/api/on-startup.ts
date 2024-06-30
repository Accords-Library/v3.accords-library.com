import type { APIRoute } from "astro";
import {  dataCache, pageCache } from "src/utils/payload";

export const GET: APIRoute = async () => {
  await dataCache.init();
  await pageCache.init();
  return new Response(null, { status: 200, statusText: "Ok" });
};
