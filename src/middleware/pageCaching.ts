import { defineMiddleware } from "astro:middleware";
import { pageCache } from "src/services";

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

    if (!pathname.includes("/api/")) {
      pageCache.set(pathname, response, [...locals.sdkCalls]);
    }
  }

  return response;
});
