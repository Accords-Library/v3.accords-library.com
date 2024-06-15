import type { APIRoute } from "astro";
import { initPayload } from "src/utils/payload";

export const GET: APIRoute = async () => {
  await initPayload();
  return new Response(null, { status: 200, statusText: "Ok" });
};
