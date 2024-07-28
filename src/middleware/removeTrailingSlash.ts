import { defineMiddleware } from "astro:middleware";
import { redirect } from "src/middleware/utils";

export const removeTrailingSlashMiddleware = defineMiddleware(({ url }, next) => {
  if (url.pathname.endsWith("/")) {
    url.pathname = url.pathname.substring(0, url.pathname.length - 1);
    return redirect(url.toString());
  }
  return next();
});
