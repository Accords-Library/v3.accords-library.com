import { defineMiddleware } from "astro:middleware";
import { pageCache } from "src/cache/pageCache";

export const pageCachingMiddleware = defineMiddleware(async ({ url, request }, next) => {
  const pathname = url.pathname;
  const cachedPage = pageCache.get(pathname);

  if (cachedPage) {
    const modifiedSince = request.headers.get("If-Modified-Since");
    const lastModified = cachedPage.headers.get("Last-Modified");

    if (modifiedSince && lastModified && new Date(modifiedSince) <= new Date(lastModified)) {
      return new Response(null, { status: 304, statusText: "Not Modified" });
    }

    return cachedPage;
  }

  const response = await next();

  if (response.ok) {
    response.headers.set("Last-Modified", new Date().toUTCString());
    pageCache.set(pathname, response);
  }

  return response;
});
