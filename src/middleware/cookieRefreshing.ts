import { defineMiddleware } from "astro:middleware";
import { CookieKeys, isValidCurrency, isValidLocale, isValidTheme } from "src/middleware/utils";

const ninetyDaysInSeconds = 60 * 60 * 24 * 90;

export const cookieRefreshingMiddleware = defineMiddleware(async ({ cookies }, next) => {
  const response = await next();

  const theme = cookies.get(CookieKeys.Theme)?.value;
  if (isValidTheme(theme) && theme !== "auto") {
    cookies.set(CookieKeys.Theme, theme, {
      maxAge: ninetyDaysInSeconds,
      path: "/",
      sameSite: "strict",
    });
  } else if (theme) {
    cookies.set(CookieKeys.Theme, theme, {
      maxAge: 0,
      path: "/",
      sameSite: "strict",
    });
  }

  const currency = cookies.get(CookieKeys.Currency)?.value;
  if (isValidCurrency(currency)) {
    cookies.set(CookieKeys.Currency, currency, {
      maxAge: ninetyDaysInSeconds,
      path: "/",
      sameSite: "strict",
    });
  } else if (currency) {
    cookies.set(CookieKeys.Currency, currency, {
      maxAge: 0,
      path: "/",
      sameSite: "strict",
    });
  }

  const language = cookies.get(CookieKeys.Language)?.value;
  if (isValidLocale(language)) {
    cookies.set(CookieKeys.Language, language, {
      maxAge: ninetyDaysInSeconds,
      path: "/",
      sameSite: "strict",
    });
  } else if (language) {
    cookies.set(CookieKeys.Language, language, {
      maxAge: 0,
      path: "/",
      sameSite: "strict",
    });
  }

  return response;
});
