import { defineMiddleware } from "astro:middleware";
import { trackEvent } from "src/shared/analytics/analytics";
import { defaultLocale } from "src/i18n/i18n";
import {
  getAbsoluteLocaleUrl,
  getBestAcceptedLanguage,
  getCookieLocale,
  getCurrentLocale,
  redirect,
} from "src/middleware/utils";

const localeAgnosticPaths = ["/api/"];

export const localeNegotiationMiddleware = defineMiddleware(({ cookies, url, request }, next) => {
  if (localeAgnosticPaths.some((prefix) => url.pathname.includes(prefix))) {
    return next();
  }

  const currentLocale = getCurrentLocale(url.pathname);
  const acceptedLocale = getBestAcceptedLanguage(request);
  const cookieLocale = getCookieLocale(cookies);
  const bestMatchingLocale = cookieLocale ?? acceptedLocale ?? currentLocale ?? defaultLocale;

  if (!currentLocale) {
    const redirectURL = getAbsoluteLocaleUrl(bestMatchingLocale, url.pathname);
    trackEvent("locale-redirect");
    return redirect(redirectURL);
  }

  if (currentLocale !== bestMatchingLocale) {
    const pathnameWithoutLocale = url.pathname.substring(currentLocale.length + 1);
    const redirectURL = getAbsoluteLocaleUrl(bestMatchingLocale, pathnameWithoutLocale);
    trackEvent("locale-redirect");
    return redirect(redirectURL);
  }

  return next();
});
