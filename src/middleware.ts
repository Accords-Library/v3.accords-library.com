import { defineMiddleware, sequence } from "astro:middleware";
import {
  defaultLocale,
  getCurrentLocale,
  getBestAcceptedLanguage,
} from "translations/translations";
import {
  CookieKeys,
  getCookieCurrency,
  getCookieLocale,
  getCookieTheme,
  isValidCurrency,
  isValidLocale,
  themeSchema,
} from "src/utils/cookies";

const getAbsoluteLocaleUrl = (locale: string, url: string) =>
  `/${locale}${url}`;

const redirect = (
  redirectURL: string,
  headers: Record<string, string> = {}
): Response => {
  return new Response(undefined, {
    headers: { ...headers, Location: redirectURL },
    status: 302,
    statusText: "Found",
  });
};

const localeAgnosticPaths = ["/api/"];

const localeNegotiator = defineMiddleware(({ cookies, url, request }, next) => {
  if (localeAgnosticPaths.some((prefix) => url.pathname.startsWith(prefix))) {
    return next();
  }

  const currentLocale = getCurrentLocale(url.pathname);
  const acceptedLocale = getBestAcceptedLanguage(request);
  const cookieLocale = getCookieLocale(cookies);
  const bestMatchingLocale =
    cookieLocale ?? acceptedLocale ?? currentLocale ?? defaultLocale;

  if (!currentLocale) {
    const redirectURL = getAbsoluteLocaleUrl(bestMatchingLocale, url.pathname);
    return redirect(redirectURL);
  }

  if (currentLocale !== bestMatchingLocale) {
    const pathnameWithoutLocale = url.pathname.substring(
      currentLocale.length + 1
    );
    const redirectURL = getAbsoluteLocaleUrl(
      bestMatchingLocale,
      pathnameWithoutLocale
    );
    return redirect(redirectURL);
  }

  return next();
});

const handleActionsSearchParams = defineMiddleware(async ({ url }, next) => {
  const actionLang = url.searchParams.get("action-lang");
  if (isValidLocale(actionLang)) {
    const currentLocale = getCurrentLocale(url.pathname);
    const pathnameWithoutLocale = currentLocale
      ? url.pathname.substring(currentLocale.length + 1)
      : url.pathname;
    const redirectURL = getAbsoluteLocaleUrl(actionLang, pathnameWithoutLocale);
    return redirect(redirectURL, {
      "Set-Cookie": `${CookieKeys.Languages}=${JSON.stringify([
        actionLang,
      ])}; Path=/`,
    });
  }

  const actionCurrency = url.searchParams.get("action-currency");
  if (isValidCurrency(actionCurrency)) {
    return redirect(url.pathname, {
      "Set-Cookie": `${CookieKeys.Currency}=${JSON.stringify(
        actionCurrency
      )}; Path=/`,
    });
  }

  const actionTheme = url.searchParams.get("action-theme");
  const verifiedActionTheme = themeSchema.safeParse(actionTheme);
  if (verifiedActionTheme.success) {
    url.searchParams.delete("action-theme");
    if (verifiedActionTheme.data === "auto") {
      return redirect(url.pathname, {
        "Set-Cookie": `${CookieKeys.Theme}=; Path=/; Expires=${new Date(
          0
        ).toUTCString()}`,
      });
    }
    return redirect(url.pathname, {
      "Set-Cookie": `${CookieKeys.Theme}=${verifiedActionTheme.data}; Path=/`,
    });
  }

  return next();
});

const addContentLanguageResponseHeader = defineMiddleware(
  async ({ url }, next) => {
    const currentLocale = getCurrentLocale(url.pathname);

    const response = await next();
    if (response.status === 200 && currentLocale) {
      response.headers.set("Content-Language", currentLocale);
    }
    return response;
  }
);

const provideLocalsToRequest = defineMiddleware(
  async ({ url, locals, cookies }, next) => {
    locals.currentLocale = getCurrentLocale(url.pathname) ?? "en";
    locals.currentCurrency = getCookieCurrency(cookies) ?? "USD";
    locals.currentTheme = getCookieTheme(cookies) ?? "auto";
    return next();
  }
);

export const onRequest = sequence(
  addContentLanguageResponseHeader,
  handleActionsSearchParams,
  localeNegotiator,
  provideLocalsToRequest
);
