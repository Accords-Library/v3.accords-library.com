import { defineMiddleware, sequence } from "astro:middleware";
import acceptLanguage from "accept-language";
import type { AstroCookies } from "astro";
import { z } from "astro:content";
import { trackRequest, trackEvent } from "src/shared/analytics/analytics";
import { defaultLocale } from "src/i18n/i18n";
import { contextCache } from "src/cache/contextCache";

const ninetyDaysInSeconds = 60 * 60 * 24 * 90;

const getAbsoluteLocaleUrl = (locale: string, url: string) => `/${locale}${url}`;

const redirect = (redirectURL: string, headers: Record<string, string> = {}): Response => {
  return new Response(undefined, {
    headers: { ...headers, Location: redirectURL },
    status: 302,
    statusText: "Found",
  });
};

const localeAgnosticPaths = ["/api/"];

const localeNegotiator = defineMiddleware(({ cookies, url, request }, next) => {
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

const handleActionsSearchParams = defineMiddleware(
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

const refreshCookiesMaxAge = defineMiddleware(async ({ cookies }, next) => {
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

const addCommonHeaders = defineMiddleware(async ({ url }, next) => {
  const currentLocale = getCurrentLocale(url.pathname);

  const response = await next();
  if (response.ok && currentLocale) {
    response.headers.set("Content-Language", currentLocale);
  }

  response.headers.set("Vary", "Cookie");

  return response;
});

const provideLocalsToRequest = defineMiddleware(async ({ url, locals, cookies }, next) => {
  locals.currentLocale = getCurrentLocale(url.pathname) ?? "en";
  locals.currentCurrency = getCookieCurrency(cookies) ?? "USD";
  return next();
});

const analytics = defineMiddleware(async (context, next) => {
  const { request, params, locals, clientAddress } = context;
  const response = await next();
  trackRequest(request, { params, locals, clientAddress });
  return response;
});

const postProcess = defineMiddleware(async ({ cookies }, next) => {
  const response = await next();
  if (!response.ok) {
    return response;
  }

  let html = await response.text();

  const currentTheme = getCookieTheme(cookies) ?? "auto";
  html = html.replace(
    "POST_PROCESS_HTML_CLASS",
    currentTheme === "dark" ? "dark-theme" : currentTheme === "light" ? "light-theme" : ""
  );
  return new Response(html, response);
});

export const onRequest = sequence(
  // Possible redirect
  handleActionsSearchParams,
  localeNegotiator,

  addCommonHeaders,

  // Get a response
  analytics,
  refreshCookiesMaxAge,
  provideLocalsToRequest,
  postProcess
);

/* LOCALE */

const getCurrentLocale = (pathname: string): string | undefined => {
  for (const locale of contextCache.locales) {
    if (pathname.split("/")[1] === locale.id) {
      return locale.id;
    }
  }
  return undefined;
};

const getBestAcceptedLanguage = (request: Request): string | undefined => {
  const header = request.headers.get("Accept-Language");
  if (!header) return;

  acceptLanguage.languages(contextCache.locales.map(({ id }) => id));

  return acceptLanguage.get(request.headers.get("Accept-Language")) ?? undefined;
};

/* COOKIES */

export enum CookieKeys {
  Currency = "al_pref_currency",
  Theme = "al_pref_theme",
  Language = "al_pref_language",
}

const themeSchema = z.enum(["dark", "light", "auto"]);

export const getCookieLocale = (cookies: AstroCookies): string | undefined => {
  const cookieValue = cookies.get(CookieKeys.Language)?.value;
  return isValidLocale(cookieValue) ? cookieValue : undefined;
};

export const getCookieCurrency = (cookies: AstroCookies): string | undefined => {
  const cookieValue = cookies.get(CookieKeys.Currency)?.value;
  return isValidCurrency(cookieValue) ? cookieValue : undefined;
};

export const getCookieTheme = (cookies: AstroCookies): z.infer<typeof themeSchema> | undefined => {
  const cookieValue = cookies.get(CookieKeys.Theme)?.value;
  return isValidTheme(cookieValue) ? cookieValue : undefined;
};

export const isValidCurrency = (currency: string | null | undefined): currency is string =>
  currency !== null && currency != undefined && contextCache.currencies.includes(currency);

export const isValidLocale = (locale: string | null | undefined): locale is string =>
  locale !== null &&
  locale != undefined &&
  contextCache.locales.map(({ id }) => id).includes(locale);

export const isValidTheme = (
  theme: string | null | undefined
): theme is z.infer<typeof themeSchema> => {
  const result = themeSchema.safeParse(theme);
  return result.success;
};
