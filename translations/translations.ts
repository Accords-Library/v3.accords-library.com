import { cache } from "src/utils/cachedPayload";
import en from "./en.json";
import fr from "./fr.json";
import ja from "./ja.json";

import acceptLanguage from "accept-language";
import { KeysTypes } from "src/shared/payload/payload-sdk";

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

  const getLocalizedMatch = <T extends { language: string }>(
    options: T[],
    fallback: Omit<T, "language">
  ): Omit<T, "language"> & { language?: string } =>
    options.find(({ language }) => language === locale) ??
    options.find(({ language }) => language === defaultLocale) ?? {
      ...fallback,
    };

  const getLocalizedKey = (
    keyType: KeysTypes,
    keyId: string,
    format: "short" | "default"
  ) => {
    const category = cache.keys.find(
      ({ id, type }) => id === keyId && type === keyType
    );

    if (!category) {
      return "UNKNOWN";
    }
    if (!category.translations) {
      return category.name;
    }

    const translation = getLocalizedMatch(category.translations, {
      name: category.name,
      short: category.name,
    });

    return format === "default" ? translation.name : translation.short;
  };

  return {
    t: (key: WordingKeys, values: Record<string, any> = {}): string => {
      if (translations && key in translations) {
        return formatWithValues(key, translations[key]!, values);
      }
      return `«${key}»`;
    },
    getLocalizedUrl: (url: string): string => `/${locale}${url}`,
    getLocalizedMatch,
    formatCategory: (
      id: string,
      format: "short" | "default" = "default"
    ): string => getLocalizedKey(KeysTypes.Categories, id, format),
    formatContentType: (id: string): string =>
      getLocalizedKey(KeysTypes.Contents, id, "default"),
    formatRecorder: (recorderId: string): string => {
      const result = cache.recorders.find(({ id }) => id === recorderId);

      if (!result) {
        return "UNKNOWN";
      }

      return result.username;
    },
    formatLocale: (code: string): string =>
      cache.locales.find(({ id }) => id === code)?.name ?? code,
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
    if (pathname.startsWith(`/${locale.id}`)) {
      return locale.id;
    }
  }
  return undefined;
};

export const getBestAcceptedLanguage = (
  request: Request
): Locale | undefined => {
  acceptLanguage.languages(cache.locales.map(({ id }) => id));

  return (
    (acceptLanguage.get(
      request.headers.get("Accept-Language")
    ) as Locale | null) ?? undefined
  );
};
