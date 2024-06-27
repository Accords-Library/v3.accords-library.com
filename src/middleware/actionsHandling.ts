import { defineMiddleware } from "astro:middleware";
import {
  CookieKeys,
  getAbsoluteLocaleUrl,
  getCurrentLocale,
  isValidCurrency,
  isValidLocale,
  isValidTheme,
  redirect,
} from "src/middleware/utils";
import { trackEvent } from "src/shared/analytics/analytics";

const ninetyDaysInSeconds = 60 * 60 * 24 * 90;

export const actionsHandlingMiddleware = defineMiddleware(
  async ({ url: { pathname, searchParams }, cookies }, next) => {
    const language = searchParams.get("action-lang");
    if (isValidLocale(language)) {
      const currentLocale = getCurrentLocale(pathname);
      const pathnameWithoutLocale = currentLocale
        ? pathname.substring(currentLocale.length + 1)
        : pathname;
      const redirectURL = getAbsoluteLocaleUrl(language, pathnameWithoutLocale);
      trackEvent("action-lang");
      cookies.set(CookieKeys.Language, language, {
        maxAge: ninetyDaysInSeconds,
        path: "/",
        sameSite: "strict",
      });
      return redirect(redirectURL);
    }

    const currency = searchParams.get("action-currency");
    if (isValidCurrency(currency)) {
      trackEvent("action-currency");
      cookies.set(CookieKeys.Currency, currency, {
        maxAge: ninetyDaysInSeconds,
        path: "/",
        sameSite: "strict",
      });
      return redirect(pathname);
    }

    const theme = searchParams.get("action-theme");
    if (isValidTheme(theme)) {
      trackEvent("action-theme");
      cookies.set(CookieKeys.Theme, theme, {
        maxAge: theme === "auto" ? 0 : ninetyDaysInSeconds,
        path: "/",
        sameSite: "strict",
      });
      return redirect(pathname);
    }

    return next();
  }
);
