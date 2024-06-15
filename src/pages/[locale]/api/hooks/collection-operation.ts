import type { APIRoute } from "astro";
import {
  Collections,
  WebHookOperationType,
  type WebHookMessage,
} from "src/shared/payload/payload-sdk";
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

  const { collection, operation, id } = (await request.json()) as WebHookMessage;
  console.log("[Webhook] Received message from CMS:", { collection, Collections, id });

  if (id && operation !== WebHookOperationType.create) {
    await invalidateDataCache(id);
  }

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

  return new Response(null, { status: 200, statusText: "Ok" });
};
