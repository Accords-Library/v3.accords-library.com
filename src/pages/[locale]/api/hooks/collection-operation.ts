import type { APIRoute } from "astro";
import { contextCache, dataCache } from "src/utils/payload.ts";
import { Collections, type AfterOperationWebHookMessage } from "src/shared/payload/payload-sdk";

export const POST: APIRoute = async ({ request }) => {
  const auth = request.headers.get("Authorization");

  if (auth !== `Bearer ${import.meta.env.WEB_HOOK_TOKEN}`) {
    return new Response(null, { status: 403, statusText: "Forbidden" });
  }

  const message = (await request.json()) as AfterOperationWebHookMessage;
  console.log("[Webhook] Received messages from CMS:", message);

  // Not awaiting on purpose to respond with a 202 and not block the CMS
  handleWebHookMessage(message);

  return new Response(null, { status: 202, statusText: "Accepted" });
};

const handleWebHookMessage = async ({
  addedDependantIds,
  collection,
  urls,
  id,
}: AfterOperationWebHookMessage) => {
  await dataCache.invalidate([...(id ? [id] : []), ...addedDependantIds], urls);

  switch (collection) {
    case Collections.Wordings:
      await contextCache.refreshWordings();
      break;

    case Collections.Currencies:
      await contextCache.refreshCurrencies();
      break;

    case Collections.Languages:
      await contextCache.refreshLocales();
      break;

    case Collections.WebsiteConfig:
      await contextCache.refreshWebsiteConfig();
      break;
  }
};
