import { sequence } from "astro:middleware";
import { postProcessingMiddleware } from "src/middleware/postProcessing";
import { localeNegotiationMiddleware } from "src/middleware/languageNegotiation";
import { cookieRefreshingMiddleware } from "src/middleware/cookieRefreshing";
import { addCommonHeadersMiddleware } from "src/middleware/commonHeaders";
import { actionsHandlingMiddleware } from "src/middleware/actionsHandling";
import { requestTrackingMiddleware } from "src/middleware/requestTracking";
import { pageCachingMiddleware } from "src/middleware/pageCaching";
import { setAstroLocalsMiddleware } from "src/middleware/setAstroLocals";

export const onRequest = sequence(
  // Possible redirect
  actionsHandlingMiddleware,
  localeNegotiationMiddleware,

  addCommonHeadersMiddleware,

  // Get a response
  requestTrackingMiddleware,
  cookieRefreshingMiddleware,
  setAstroLocalsMiddleware,

  // Generate body
  postProcessingMiddleware,
  pageCachingMiddleware
);
