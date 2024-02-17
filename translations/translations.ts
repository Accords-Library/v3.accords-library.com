import { cache } from "src/utils/cachedPayload";
import en from "./en.json";
import fr from "./fr.json";
import ja from "./ja.json";

import acceptLanguage from "accept-language";

type WordingKeys = keyof typeof en;
const translationFiles: Record<string, Record<WordingKeys, string>> = {
  en,
  fr,
  ja,
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
    getLocalizedMatch: <T extends { language: string }>(
      options: T[],
      fallback: Omit<T, "language">
    ): Omit<T, "language"> =>
      options.find(({ language }) => language === locale) ??
      options.find(({ language }) => language === defaultLocale) ??
      fallback,
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

export type Locale = string;
export const defaultLocale: Locale = "en";

export const getCurrentLocale = (pathname: string): Locale | undefined => {
  for (const locale of cache.locales) {
    if (pathname.startsWith(`/${locale}`)) {
      return locale;
    }
  }
  return undefined;
};

export const getBestAcceptedLanguage = (
  request: Request
): Locale | undefined => {
  acceptLanguage.languages(cache.locales);

  return (
    (acceptLanguage.get(
      request.headers.get("Accept-Language")
    ) as Locale | null) ?? undefined
  );
};
