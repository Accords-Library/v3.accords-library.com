import type { APIRoute } from "astro";
import { dataCache } from "src/cache/dataCache";

export const GET: APIRoute = async () => {
  await dataCache.init();
  return new Response(null, { status: 200, statusText: "Ok" });
};
