import type { I18n } from "src/i18n/i18n";
import { AttributeTypes, type EndpointAttribute } from "src/shared/payload/payload-sdk";

export type Attribute = {
  icon: string;
  title: string;
  lang?: string | undefined;
  values: { name: string; href?: string | undefined; lang?: string | undefined }[];
  withBorder?: boolean | undefined;
};

export const convertEndpointAttributeToAttribute = (
  endpointAttribute: EndpointAttribute,
  { getLocalizedMatch, getLocalizedUrl, formatNumber }: I18n
): Attribute => {
  const { icon, translations, value, type } = endpointAttribute;
  const { language: lang, name: title } = getLocalizedMatch(translations);

  switch (type) {
    case AttributeTypes.Number:
      return { icon, title, lang, values: [{ name: formatNumber(value) }] };

    case AttributeTypes.Text:
      return { icon, title, lang, values: [{ name: value }] };

    case AttributeTypes.Tags:
      return {
        icon,
        title,
        lang,
        values: value.map(({ translations, page }) => {
          const { name, language } = getLocalizedMatch(translations);
          return {
            name,
            lang: language,
            ...(page ? { href: getLocalizedUrl(`/pages/${page.slug}`) } : {}),
          };
        }),
      };
  }
};
