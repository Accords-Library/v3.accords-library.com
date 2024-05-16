import type { WordingKey } from "src/i18n/wordings-keys";
import type { ChronologyEvent, EndpointSource } from "src/shared/payload/payload-sdk";
import { cache } from "src/utils/payload";
import { capitalize, formatInlineTitle } from "src/utils/format";

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

  const getLocalizedMatch = <T extends { language: string }>(options: T[]): T =>
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

  const formatPrice = (price: { amount: number; currency: string }): string =>
    price.amount.toLocaleString(locale, { style: "currency", currency: price.currency });

  const formatDate = (
    date: Date,
    options: Intl.DateTimeFormatOptions | undefined = { dateStyle: "medium" }
  ): string => date.toLocaleDateString(locale, options);

  const formatDuration = (durationInSec: number) => {
    const hours = Math.floor(durationInSec / 3600);
    durationInSec -= hours * 3600;
    const minutes = Math.floor(durationInSec / 60);
    durationInSec -= minutes * 60;
    const seconds = Math.floor(durationInSec);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatFilesize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1_000) return `${formatNumber(sizeInBytes, { maximumFractionDigits: 2 })} B`;
    sizeInBytes = sizeInBytes / 1000;
    if (sizeInBytes < 1_000) return `${formatNumber(sizeInBytes, { maximumFractionDigits: 2 })} KB`;
    sizeInBytes = sizeInBytes / 1000;
    if (sizeInBytes < 1_000) return `${formatNumber(sizeInBytes, { maximumFractionDigits: 2 })} MB`;
    sizeInBytes = sizeInBytes / 1000;
    return `${formatNumber(sizeInBytes, { maximumFractionDigits: 2 })} GB`;
  };

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

  const formatTimelineDate = ({ year, month, day }: ChronologyEvent["date"]): string => {
    const date = new Date(0);
    date.setFullYear(year);
    if (month) date.setMonth(month - 1);
    if (day) date.setDate(day);

    return capitalize(
      formatDate(date, {
        year: "numeric",
        month: month ? "long" : undefined,
        day: day ? "numeric" : undefined,
      })
    );
  };

  const formatScanIndexShort = (index: string) => {
    switch (index) {
      case "cover-flap-front":
      case "dustjacket-flap-front":
      case "dustjacket-inside-flap-front":
      case "obi-flap-front":
      case "obi-inside-flap-front":
        return t("collectibles.scans.shortIndex.flapFront");

      case "cover-front":
      case "cover-inside-front":
      case "dustjacket-front":
      case "dustjacket-inside-front":
      case "obi-front":
      case "obi-inside-front":
        return t("collectibles.scans.shortIndex.front");

      case "cover-spine":
      case "dustjacket-spine":
      case "dustjacket-inside-spine":
      case "obi-spine":
      case "obi-inside-spine":
        return t("collectibles.scans.shortIndex.spine");

      case "cover-back":
      case "cover-inside-back":
      case "dustjacket-back":
      case "dustjacket-inside-back":
      case "obi-back":
      case "obi-inside-back":
        return t("collectibles.scans.shortIndex.back");

      case "cover-flap-back":
      case "dustjacket-flap-back":
      case "dustjacket-inside-flap-back":
      case "obi-flap-back":
      case "obi-inside-flap-back":
        return t("collectibles.scans.shortIndex.flapBack");

      default:
        return index;
    }
  };

  const formatEndpointSource = (source: EndpointSource) => {
    switch (source.type) {
      case "url":
        return {
          href: source.url,
          typeLabel: t("global.sources.typeLabel.url"),
          label: source.label,
          target: "_blank",
          rel: "noopener noreferrer",
        };

      case "collectible":
        const rangeLabel = (() => {
          switch (source.range?.type) {
            case "timestamp":
              return t("global.sources.typeLabel.collectible.range.timestamp", {
                page: source.range.timestamp,
              });

            case "page":
              return t("global.sources.typeLabel.collectible.range.page", {
                page: source.range.page,
              });

            case "custom":
              return t("global.sources.typeLabel.collectible.range.custom", {
                note: getLocalizedMatch(source.range.translations).note,
              });

            case undefined:
            default:
              return "";
          }
        })();

        return {
          href: getLocalizedUrl(`/collectibles/${source.collectible.slug}`),
          typeLabel: t("global.sources.typeLabel.collectible"),
          label: formatInlineTitle(getLocalizedMatch(source.collectible.translations)) + rangeLabel,
        };

      case "page":
        return {
          href: getLocalizedUrl(`/pages/${source.page.slug}`),
          typeLabel: t("global.sources.typeLabel.page"),
          label: formatInlineTitle(getLocalizedMatch(source.page.translations)),
        };

      case "folder":
        return {
          href: getLocalizedUrl(`/folders/${source.folder.slug}`),
          typeLabel: t("global.sources.typeLabel.folder"),
          label: getLocalizedMatch(source.folder.translations).name,
        };

      case "scans":
        return {
          href: getLocalizedUrl(`/collectibles/${source.collectible.slug}/scans`),
          typeLabel: t("global.sources.typeLabel.scans"),
          label: formatInlineTitle(getLocalizedMatch(source.collectible.translations)),
        };

      case "gallery":
        return {
          href: getLocalizedUrl(`/collectibles/${source.collectible.slug}/gallery`),
          typeLabel: t("global.sources.typeLabel.gallery"),
          label: formatInlineTitle(getLocalizedMatch(source.collectible.translations)),
        };

      default:
        return {
          href: "/404",
          label: `Invalid type ${source["type"]}`,
          typeLabel: "Error",
        };
    }
  };

  return {
    t,
    getLocalizedMatch,
    getLocalizedUrl,
    formatPrice,
    formatDate,
    formatDuration,
    formatInches,
    formatPounds,
    formatGrams,
    formatMillimeters,
    formatNumber,
    formatTimelineDate,
    formatEndpointSource,
    formatScanIndexShort,
    formatFilesize,
  };
};
