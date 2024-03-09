import { cache } from "src/utils/cachedPayload";

export const formatLocale = (code: string): string =>
  cache.locales.find(({ id }) => id === code)?.name ?? code;

export const formatInlineTitle = ({
  pretitle,
  title,
  subtitle,
}: {
  pretitle?: string | undefined;
  title: string;
  subtitle?: string | undefined;
}): string => {
  let result = "";
  if (pretitle) {
    result += `${pretitle}: `;
  }
  result += title;
  if (subtitle) {
    result += ` — ${subtitle}`;
  }
  return result;
};
