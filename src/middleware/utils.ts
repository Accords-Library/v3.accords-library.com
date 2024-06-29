import type { AstroCookies } from "astro";
import { z } from "astro:content";
import { contextCache } from "src/utils/payload";
import acceptLanguage from "accept-language";

export const getAbsoluteLocaleUrl = (locale: string, url: string) => `/${locale}${url}`;

export const redirect = (redirectURL: string, headers: Record<string, string> = {}): Response => {
  return new Response(undefined, {
    headers: { ...headers, Location: redirectURL },
    status: 302,
    statusText: "Found",
  });
};

/* LOCALE */

export const getCurrentLocale = (pathname: string): string | undefined => {
  for (const locale of contextCache.locales) {
    if (pathname.split("/")[1] === locale.id) {
      return locale.id;
    }
  }
  return undefined;
};

export const getBestAcceptedLanguage = (request: Request): string | undefined => {
  const header = request.headers.get("Accept-Language");
  if (!header || header === "*") return;

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
