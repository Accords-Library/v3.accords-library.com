import type { APIRoute } from "astro";
import { Collections, type AfterOperationWebHookMessage } from "src/shared/payload/payload-sdk";
import {
  invalidateDataCache,
  refreshCurrencies,
  refreshLocales,
  refreshWebsiteConfig,
  refreshWordings,
} from "src/utils/payload";

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
  await invalidateDataCache([...(id ? [id] : []), ...addedDependantIds], urls);

  switch (collection) {
    case Collections.Wordings:
      await refreshWordings();
      break;

    case Collections.Currencies:
      await refreshCurrencies();
      break;

    case Collections.Languages:
      await refreshLocales();
      break;

    case Collections.WebsiteConfig:
      await refreshWebsiteConfig();
      break;
  }
};
