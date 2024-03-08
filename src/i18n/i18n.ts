import type { WordingKey } from "src/i18n/wordings-keys";
import { cache } from "src/utils/cachedPayload";

export const defaultLocale = "en";

export const getI18n = async (locale: string) => {
  const formatWithValues = (
    templateName: string,
    template: string,
    values: Record<string, any>
  ): string => {
    const limitMatchToBalanceCurlyBraces = (matchArray: RegExpMatchArray): string => {
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

    Object.entries(values).forEach(([key, value]) => {
      if (!template.match(new RegExp(`{{ ${key}\\+|{{ ${key}\\?|{{ ${key} }}`))) {
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
          ...template.matchAll(new RegExp(`{{ ${key}\\+,[\\w\\s=>{},]+ }}`, "g")),
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
              const optionConditionValue = Number.parseInt(optionCondition.substring(1));
              if (value === optionConditionValue) {
                return optionValue;
              }
            } else if (option.startsWith(">")) {
              const optionConditionValue = Number.parseInt(optionCondition.substring(1));
              if (value > optionConditionValue) {
                return optionValue;
              }
            } else if (option.startsWith("<")) {
              const optionConditionValue = Number.parseInt(optionCondition.substring(1));
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
      const matches = [...template.matchAll(new RegExp(`{{ ${key}\\?,[\\w\\s{},]+ }}`, "g"))].map(
        limitMatchToBalanceCurlyBraces
      );

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
    options: T[]
  ): Omit<T, "language"> & { language?: string } =>
    options.find(({ language }) => language === locale) ??
    options.find(({ language }) => language === defaultLocale) ??
    options[0]!; // We will consider that there will always be at least one option.

  const t = (key: WordingKey, values: Record<string, any> = {}): string => {
    const wording = cache.wordings.find(({ name }) => name === key);
    const fallbackString = `«${key}»`;

    if (!wording) {
      return fallbackString;
    }

    const matchingWording = getLocalizedMatch(wording.translations).name;
    return formatWithValues(key, matchingWording, values);
  };

  const getLocalizedUrl = (url: string): string => `/${locale}${url}`;

  const formatTag = (id: string): string => {
    const tag = cache.tags.find(({ slug }) => slug === id);
    if (!tag) return "UNKNOWN";
    return getLocalizedMatch(tag.translations).name;
  };

  const formatTagsGroup = (id: string): string => {
    const tag = cache.tagsGroups.find(({ slug }) => slug === id);
    if (!tag) return "UNKNOWN";
    return getLocalizedMatch(tag.translations).name;
  };

  const formatPrice = (price: { amount: number; currency: string }): string =>
    price.amount.toLocaleString(locale, { style: "currency", currency: price.currency });

  const formatDate = (date: Date): string =>
    date.toLocaleDateString(locale, { dateStyle: "medium" });

  const formatInches = (sizeInMm: number): string => {
    return (
      (sizeInMm * 0.039370078740157).toLocaleString(locale, { maximumFractionDigits: 2 }) + " in"
    );
  };

  const formatMillimeters = (sizeInMm: number): string => {
    return sizeInMm.toLocaleString(locale, { maximumFractionDigits: 0 }) + " mm";
  };

  const formatPounds = (weightInGrams: number): string => {
    return (
      (weightInGrams * 0.002204623).toLocaleString(locale, { maximumFractionDigits: 2 }) + " lb"
    );
  };

  const formatGrams = (weightInGrams: number): string => {
    return weightInGrams.toLocaleString(locale, { maximumFractionDigits: 0 }) + " g";
  };

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    return number.toLocaleString(locale, options);
  };

  return {
    t,
    getLocalizedMatch,
    getLocalizedUrl,
    formatTag,
    formatTagsGroup,
    formatPrice,
    formatDate,
    formatInches,
    formatPounds,
    formatGrams,
    formatMillimeters,
    formatNumber,
  };
};
