import type { APIRoute } from "astro";
import type { AfterOperationWebHookMessage } from "src/shared/payload/payload-sdk";
import { invalidateDataCache } from "src/utils/payload";

export const POST: APIRoute = async ({ request }) => {
  const auth = request.headers.get("Authorization");

  if (auth !== `Bearer ${import.meta.env.WEB_HOOK_TOKEN}`) {
    return new Response(null, { status: 403, statusText: "Forbidden" });
  }

  const message = (await request.json()) as AfterOperationWebHookMessage;
  console.log("[Webhook] Received messages from CMS:", message);

  await invalidateDataCache(
    [...(message.id ? [message.id] : []), ...message.addedDependantIds],
    message.urls
  );

  return new Response(null, { status: 202, statusText: "Accepted" });
};
