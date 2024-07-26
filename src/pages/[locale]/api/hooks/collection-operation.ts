import type { APIRoute } from "astro";
import { contextCache, dataCache, pageCache } from "src/services.ts";
import type { EndpointChange } from "src/shared/payload/webhooks";

export const POST: APIRoute = async ({ request, locals }) => {
  locals.pageCaching = false;

  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${import.meta.env.WEB_HOOK_TOKEN}`) {
    return new Response(null, { status: 403, statusText: "Forbidden" });
  }

  const changes = (await request.json()) as EndpointChange[];
  console.log("[Webhook] Received messages from CMS:", changes);

  // Not awaiting on purpose to respond with a 202 and not block the CMS
  handleWebHookMessage(changes);

  return new Response(null, { status: 202, statusText: "Accepted" });
};

const handleWebHookMessage = async (changes: EndpointChange[]) => {
  await dataCache.invalidate(changes);
  await contextCache.invalidate(changes);
  await pageCache.invalidate(changes);
};
