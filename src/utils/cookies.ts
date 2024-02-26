import type { AstroCookies } from "astro";
import { cache } from "src/utils/cachedPayload";
import { z } from "zod";

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
