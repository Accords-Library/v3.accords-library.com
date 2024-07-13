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
import { analytics } from "src/services";

const ninetyDaysInSeconds = 60 * 60 * 24 * 90;

export const actionsHandlingMiddleware = defineMiddleware(async ({ url, cookies }, next) => {
  const language = url.searchParams.get("action-lang");
  if (isValidLocale(language)) {
    const currentLocale = getCurrentLocale(url.pathname);
    const pathnameWithoutLocale = currentLocale
      ? url.pathname.substring(currentLocale.length + 1)
      : url.pathname;
    url.pathname = getAbsoluteLocaleUrl(language, pathnameWithoutLocale);
    url.searchParams.delete("action-lang");
    analytics.trackEvent("action-lang");
    cookies.set(CookieKeys.Language, language, {
      maxAge: ninetyDaysInSeconds,
      path: "/",
      sameSite: "strict",
    });
    return redirect(url.toString());
  }

  const currency = url.searchParams.get("action-currency");
  if (isValidCurrency(currency)) {
    analytics.trackEvent("action-currency");
    cookies.set(CookieKeys.Currency, currency, {
      maxAge: ninetyDaysInSeconds,
      path: "/",
      sameSite: "strict",
    });
    url.searchParams.delete("action-currency");
    return redirect(url.toString());
  }

  const theme = url.searchParams.get("action-theme");
  if (isValidTheme(theme)) {
    analytics.trackEvent("action-theme");
    cookies.set(CookieKeys.Theme, theme, {
      maxAge: theme === "auto" ? 0 : ninetyDaysInSeconds,
      path: "/",
      sameSite: "strict",
    });
    url.searchParams.delete("action-theme");
    return redirect(url.toString());
  }

  return next();
});
