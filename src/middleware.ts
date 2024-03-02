import { defineMiddleware, sequence } from "astro:middleware";
import { cache } from "src/utils/cachedPayload";
import acceptLanguage from "accept-language";
import type { AstroCookies } from "astro";
import { z } from "astro:content";
import { defaultLocale } from "src/i18n/i18n";

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

/* LOCALE */

const getCurrentLocale = (pathname: string): string | undefined => {
  for (const locale of cache.locales) {
    if (pathname.startsWith(`/${locale.id}`)) {
      return locale.id;
    }
  }
  return undefined;
};

const getBestAcceptedLanguage = (request: Request): string | undefined => {
  const header = request.headers.get("Accept-Language");
  if (!header) return;

  acceptLanguage.languages(cache.locales.map(({ id }) => id));

  return (
    acceptLanguage.get(request.headers.get("Accept-Language")) ?? undefined
  );
};

/* COOKIES */

export enum CookieKeys {
  Currency = "al_pref_currency",
  Theme = "al_pref_theme",
  Languages = "al_pref_languages",
}

export const themeSchema = z.enum(["dark", "light", "auto"]);

export const getCookieLocale = (cookies: AstroCookies): string | undefined => {
  const cookie = cookies.get(CookieKeys.Languages);

  try {
    const json = cookie?.json();
    const result = z.array(z.string()).nonempty().safeParse(json);
    if (result.success && isValidLocale(result.data[0])) {
      return result.data[0];
    }
  } catch (e) {
    console.error(e);
  }

  return undefined;
};

export const getCookieCurrency = (
  cookies: AstroCookies
): string | undefined => {
  const cookieValue = cookies.get(CookieKeys.Currency)?.value;
  return isValidCurrency(cookieValue) ? cookieValue : undefined;
};

export const getCookieTheme = (
  cookies: AstroCookies
): z.infer<typeof themeSchema> | undefined => {
  const cookieValue = cookies.get(CookieKeys.Theme)?.value;
  const result = themeSchema.safeParse(cookieValue);
  return result.success ? result.data : undefined;
};

export const isValidCurrency = (
  currency: string | null | undefined
): currency is string =>
  currency !== null &&
  currency != undefined &&
  cache.currencies.includes(currency);

export const isValidLocale = (
  locale: string | null | undefined
): locale is string =>
  locale !== null &&
  locale != undefined &&
  cache.locales.map(({ id }) => id).includes(locale);
