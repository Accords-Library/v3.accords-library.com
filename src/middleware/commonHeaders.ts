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
  response.headers.set("Cache-Control", "max-age=3600, stale-while-revalidate=3600");

  return response;
});
