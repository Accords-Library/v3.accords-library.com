import { defineMiddleware } from "astro:middleware";
import { getCurrentLocale } from "src/middleware/utils";

export const addCommonHeadersMiddleware = defineMiddleware(async ({ url }, next) => {
  const response = await next();

  const currentLocale = getCurrentLocale(url.pathname);
  if (currentLocale) {
    response.headers.set("Content-Language", currentLocale);
  }

  // TODO: Remove when in production
  response.headers.set("X-Robots-Tag", "none");
  response.headers.set("Vary", "Cookie");

  if (!response.headers.has("cache-control")) {
    if (import.meta.env.CACHE_CONTROL !== "true" && !response.headers.has("cache-control")) {
      response.headers.set("Cache-Control", "no-store");
    } else {
      response.headers.set("Cache-Control", "max-age=86400, stale-while-revalidate=86400");
    }
  }

  return response;
});
