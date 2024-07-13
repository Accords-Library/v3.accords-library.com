import { defineMiddleware } from "astro/middleware";
import { analytics } from "src/services";

export const requestTrackingMiddleware = defineMiddleware(async (context, next) => {
  const { request, locals, clientAddress } = context;
  const response = await next();
  analytics.trackRequest(request, {
    clientAddress,
    locale: locals.currentLocale,
    responseStatus: response.status,
  });
  return response;
});
