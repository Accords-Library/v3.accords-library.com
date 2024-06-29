import { defineMiddleware } from "astro:middleware";
import { pageCache } from "src/utils/payload";

const blacklist = ["/en/api/hooks/collection-operation", "/en/api/on-startup"];

export const pageCachingMiddleware = defineMiddleware(async ({ url, request, locals }, next) => {
  const pathname = url.pathname;
  const cachedPage = pageCache.get(pathname);

  if (cachedPage) {
    const clientTimestamp = request.headers.get("If-Modified-Since");
    const serverTimestamp = cachedPage.headers.get("Last-Modified");

    if (
      clientTimestamp &&
      serverTimestamp &&
      new Date(clientTimestamp) == new Date(serverTimestamp)
    ) {
      return new Response(null, { status: 304, statusText: "Not Modified" });
    }

    return cachedPage;
  }

  const response = await next();

  if (response.ok) {
    response.headers.set("Last-Modified", new Date().toUTCString());

    if (!blacklist.includes(pathname)) {
      pageCache.set(pathname, response, [...locals.sdkCalls]);
    }
  }

  return response;
});
