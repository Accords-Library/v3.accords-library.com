import type { AstroCookies } from "astro";
import en from "./en.json";
import fr from "./fr.json";
import ja from "./ja.json"

import acceptLanguage from 'accept-language';
import { z } from "zod";

type WordingKeys = keyof typeof en;
const translationFiles: Record<string, Record<WordingKeys, string>> = {
  en,
  fr,
  ja
};

export const getI18n = async (locale: string) => {
  const translations = translationFiles[locale];

  const formatWithValues = (
    templateName: string,
    template: string,
    values: Record<string, any>
  ): string => {
    Object.entries(values).forEach(([key, value]) => {
      if (
        !template.match(new RegExp(`{{ ${key}\\+|{{ ${key}\\?|{{ ${key} }}`))
      ) {
        console.warn(
          "Value",
          key,
          "has been provided but is not present in template",
          templateName
        );
        return;
      }

      if (typeof value === "number") {
        // Find "plural" tokens
        const matches = [
          ...template.matchAll(
            new RegExp(`{{ ${key}\\+,[\\w\\s=>{},]+ }}`, "g")
          ),
        ].map(limitMatchToBalanceCurlyBraces);

        const handlePlural = (match: string): string => {
          match = match.substring(3, match.length - 3);
          const options = match.split(",").splice(1);
          for (const option of options) {
            const optionCondition = option.split("{")[0];
            if (!optionCondition) continue;
            let optionValue = option.substring(optionCondition.length + 1);
            if (!optionValue) continue;
            optionValue = optionValue.substring(0, optionValue.length - 1);
            if (option.startsWith("=")) {
              const optionConditionValue = Number.parseInt(
                optionCondition.substring(1)
              );
              if (value === optionConditionValue) {
                return optionValue;
              }
            } else if (option.startsWith(">")) {
              const optionConditionValue = Number.parseInt(
                optionCondition.substring(1)
              );
              if (value > optionConditionValue) {
                return optionValue;
              }
            } else if (option.startsWith("<")) {
              const optionConditionValue = Number.parseInt(
                optionCondition.substring(1)
              );
              if (value < optionConditionValue) {
                return optionValue;
              }
            }
          }
          return "";
        };

        matches.forEach((match) => {
          template = template.replace(match, handlePlural(match));
        });
      }

      // Find "conditional" tokens
      const matches = [
        ...template.matchAll(new RegExp(`{{ ${key}\\?,[\\w\\s{},]+ }}`, "g")),
      ].map(limitMatchToBalanceCurlyBraces);

      const handleConditional = (match: string): string => {
        match = match.substring(3, match.length - 3);
        const options = match.split(",").splice(1);
        if (value !== undefined && value !== null && value !== "") {
          return options[0] ?? "";
        }
        return options[1] ?? "";
      };

      matches.forEach((match) => {
        template = template.replace(match, handleConditional(match));
      });

      // Find "variable" tokens
      let prettyValue = value;
      if (typeof prettyValue === "number") {
        prettyValue = prettyValue.toLocaleString(locale);
      }
      template = template.replaceAll(`{{ ${key} }}`, prettyValue);
    });
    return template;
  };

  return {
    t: (key: WordingKeys, values: Record<string, any> = {}): string => {
      if (translations && key in translations) {
        return formatWithValues(key, translations[key]!, values);
      }
      return `«${key}»`;
    },
    getLocalizedUrl: (url: string): string => `/${locale}${url}`,
  };
};

const limitMatchToBalanceCurlyBraces = (
  matchArray: RegExpMatchArray
): string => {
  // Cut match as soon as curly braces are balanced.
  const match = matchArray[0];
  let curlyCount = 2;
  let index = 2;
  while (index < match.length && curlyCount > 0) {
    if (match[index] === "{") {
      curlyCount++;
    }
    if (match[index] === "}") {
      curlyCount--;
    }
    index++;
  }
  return match.substring(0, index);
};

export const locales = ["en", "es", "fr", "ja", "pt", "zh"] as const;
acceptLanguage.languages([...locales]);

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const getCurrentLocale = (pathname: string): Locale | undefined => {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}`)) {
      return locale;
    }
  }
  return undefined;
};

export const getPreferredLocale = (request: Request): Locale | undefined => {
  return acceptLanguage.get(request.headers.get("Accept-Language")) as Locale | null ?? undefined;
};

export const getCookiePreferredLocale = (
  cookies: AstroCookies
): string | undefined => {
  const alPrefLanguages = cookies.get("al_pref_languages");

  try {
    const json = alPrefLanguages?.json();
    const result = z.array(z.string()).nonempty().safeParse(json);
    if (result.success) {
      for (const value of result.data) {
        if (locales.includes(value as Locale)) {
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
