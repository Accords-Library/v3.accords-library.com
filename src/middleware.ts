import { defineMiddleware, sequence } from "astro:middleware";
import { z } from "zod";
import {
  defaultLocale,
  getCookiePreferredLocale,
  getCurrentLocale,
  getPreferredLocale,
} from "translations/translations";

const cookieThemeSchema = z.enum(["dark", "light", "auto"]);

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

const localeNegotiator = defineMiddleware(
  ({ cookies, url, request }, next) => {
    const currentLocale = getCurrentLocale(url.pathname);
    const preferredLocale = getPreferredLocale(request);

    if (url.pathname.startsWith("/api/")) {
      return next();
    }

    const cookiePreferredLocale = getCookiePreferredLocale(cookies);

    if (!currentLocale) {
      const redirectURL = getAbsoluteLocaleUrl(
        cookiePreferredLocale ?? preferredLocale ?? defaultLocale,
        url.pathname
      );
      return redirect(redirectURL);
    }

    if (cookiePreferredLocale) {
      if (cookiePreferredLocale !== currentLocale) {
        const pathnameWithoutLocale = url.pathname.substring(
          currentLocale.length + 1
        );
        const redirectURL = getAbsoluteLocaleUrl(
          cookiePreferredLocale,
          pathnameWithoutLocale
        );
        return redirect(redirectURL);
      }
    } else if (preferredLocale) {
      if (preferredLocale !== currentLocale) {
        const pathnameWithoutLocale = url.pathname.substring(
          currentLocale.length + 1
        );
        const redirectURL = getAbsoluteLocaleUrl(
          preferredLocale,
          pathnameWithoutLocale
        );
        return redirect(redirectURL);
      }
    }

    return next();
  }
);

const handleActionsSearchParams = defineMiddleware(async ({ url }, next) => {
  // TODO: Verify locale typing
  const actionLang = url.searchParams.get("action-lang");
  if (actionLang) {
    const currentLocale = getCurrentLocale(url.pathname);
    const pathnameWithoutLocale = currentLocale
      ? url.pathname.substring(currentLocale.length + 1)
      : url.pathname;
    const redirectURL = getAbsoluteLocaleUrl(actionLang, pathnameWithoutLocale);
    return redirect(redirectURL, {
      "Set-Cookie": `al_pref_languages=${JSON.stringify([actionLang])}; Path=/`,
    });
  }

  // TODO: Verify currency typing
  const actionCurrency = url.searchParams.get("action-currency");
  if (actionCurrency) {
    return redirect(url.pathname, {
      "Set-Cookie": `al_pref_currency=${JSON.stringify(
        actionCurrency
      )}; Path=/`,
    });
  }

  const actionTheme = url.searchParams.get("action-theme");
  const verifiedActionTheme = cookieThemeSchema.safeParse(actionTheme);

  if (verifiedActionTheme.success) {
    url.searchParams.delete("action-theme");
    if (verifiedActionTheme.data === "auto") {
      return redirect(url.pathname, {
        "Set-Cookie": `al_pref_theme=; Path=/; Expires=${new Date(
          0
        ).toUTCString()}`,
      });
    }
    return redirect(url.pathname, {
      "Set-Cookie": `al_pref_theme=${verifiedActionTheme.data}; Path=/`,
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

const provideLocalsToRequest = defineMiddleware(async ({ url, locals, cookies }, next) => {
  locals.currentLocale = getCurrentLocale(url.pathname) ?? "en";
  locals.currentCurrency = cookies.get("al_pref_currency")?.value ?? "usd"
  locals.currentTheme =  cookies.get("al_pref_theme")?.value ?? "auto"
  return next();
});

export const onRequest = sequence(
  addContentLanguageResponseHeader,
  handleActionsSearchParams,
  localeNegotiator,
  provideLocalsToRequest
);
