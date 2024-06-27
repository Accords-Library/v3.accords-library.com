import { defineMiddleware } from "astro/middleware";
import { trackRequest } from "src/shared/analytics/analytics";

export const requestTrackingMiddleware = defineMiddleware(async (context, next) => {
  const { request, params, locals, clientAddress } = context;
  const response = await next();
  trackRequest(request, { params, locals, clientAddress });
  return response;
});
