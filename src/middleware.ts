import type { AstroCookies } from "astro";
import { defineMiddleware, sequence } from "astro:middleware";
import { z } from "zod";
import astroConfig from "astro.config";

const cookieThemeSchema = z.enum(["dark", "light", "auto"]);

const getAbsoluteLocaleUrl = (locale: string, url: string) =>
  `/${locale}${url}`;

const redirection = (
  redirectURL: string,
  headers: Record<string, string> = {}
): Response => {
  return new Response(undefined, {
    headers: { ...headers, Location: redirectURL },
    status: 302,
    statusText: "Found",
  });
};

export const langMiddleware = defineMiddleware(
  ({ cookies, preferredLocale, currentLocale, url }, next) => {
    const cookiePreferredLocale = getCookiePreferredLocale(cookies);
    const actionLang = url.searchParams.get("action-lang");

    if (!currentLocale) {
      currentLocale = cookiePreferredLocale ?? preferredLocale ?? "en";
      const redirectURL = getAbsoluteLocaleUrl(currentLocale, url.pathname);
      return redirection(redirectURL);
    }

    if (actionLang) {
      const pathnameWithoutLocale = url.pathname.substring(
        currentLocale.length + 1
      );
      const redirectURL = getAbsoluteLocaleUrl(
        actionLang,
        pathnameWithoutLocale
      );
      return redirection(redirectURL, {
        "Set-Cookie": `al_pref_languages=${JSON.stringify([
          actionLang,
        ])}; Path=/`,
      });
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
        return redirection(redirectURL);
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
        return redirection(redirectURL);
      }
    }
    return next();
  }
);

export const headersMiddleware = defineMiddleware(
  async ({ currentLocale, url }, next) => {
    const actionTheme = url.searchParams.get("action-theme");

    const verifiedActionTheme = cookieThemeSchema.safeParse(actionTheme);

    if (verifiedActionTheme.success) {
      url.searchParams.delete("action-theme");
      if (verifiedActionTheme.data === "auto") {
        return redirection(url.toString(), {
          "Set-Cookie": `al_pref_theme=; Path=/; Expires=${new Date(0).toUTCString()}`,
        });
      }
      return redirection(url.toString(), {
        "Set-Cookie": `al_pref_theme=${verifiedActionTheme.data}; Path=/`,
      });
    }

    const response = await next();
    if (currentLocale) {
      response.headers.set("Content-Language", currentLocale);
    }
    return response;
  }
);

export const onRequest = sequence(headersMiddleware, langMiddleware);

const getCookiePreferredLocale = (
  cookies: AstroCookies
): string | undefined => {
  const alPrefLanguages = cookies.get("al_pref_languages");

  try {
    const json = alPrefLanguages?.json();
    const result = z.array(z.string()).nonempty().safeParse(json);
    if (result.success) {
      for (const value of result.data) {
        if (astroConfig.i18n?.locales.includes(value)) {
          return value;
        }
      }
    }
  } catch (e) {
    console.error(e);
    return undefined;
  }

  return undefined;
};
