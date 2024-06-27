import { defineMiddleware } from "astro:middleware";
import { getCurrentLocale } from "src/middleware/utils";

export const setAstroLocalsMiddleware = defineMiddleware(async ({ url, locals }, next) => {
  locals.currentLocale = getCurrentLocale(url.pathname) ?? "en";
  return next();
});