import { defineMiddleware } from "astro:middleware";
import { getI18n } from "src/i18n/i18n";
import { getCookieCurrency, getCookieTheme } from "src/middleware/utils";
import { convert } from "src/utils/currencies";

export enum PostProcessingTags {
  HTML_CLASS = "POST_PROCESS_HTML_CLASS",
  PRICE_START = "POST_PROCESS_PRICE_START",
  PRICE_END = "POST_PROCESS_PRICE_END",
  PREFERRED_CURRENCY = "POST_PROCESS_PREFERRED_CURRENCY",
  CURRENCY_UNDERLINE_START = "POST_PROCESS_CURRENCY_UNDERLINE_START",
  CURRENCY_UNDERLINE_END = "POST_PROCESS_CURRENCY_UNDERLINE_END",
}

const priceRegex = new RegExp(
  `${PostProcessingTags.PRICE_START}(.*?)${PostProcessingTags.PRICE_END}`,
  "g"
);

const selectedCurrencyRegex = new RegExp(
  `${PostProcessingTags.CURRENCY_UNDERLINE_START}(.*?)${PostProcessingTags.CURRENCY_UNDERLINE_END}`,
  "g"
);

type PostProcessingCurrency = {
  currency: string;
};

export const prepareClassForSelectedCurrencyPostProcessing = (currency: PostProcessingCurrency) =>
  `${PostProcessingTags.CURRENCY_UNDERLINE_START}${JSON.stringify(currency)}${PostProcessingTags.CURRENCY_UNDERLINE_END}`;

type PostProcessingPrice = {
  amount: number;
  currency: string;
  format: "short" | "long";
};

export const formatPriceForPostProcessing = (
  price: Omit<PostProcessingPrice, "format">,
  format: "short" | "long"
): string =>
  `${PostProcessingTags.PRICE_START}${JSON.stringify({ ...price, format })}${PostProcessingTags.PRICE_END}`;

export const postProcessingMiddleware = defineMiddleware(async ({ cookies, locals }, next) => {
  const { formatPrice, t } = await getI18n(locals.currentLocale);
  const currentCurrency = getCookieCurrency(cookies) ?? "USD";

  const response = await next();

  if (!response.ok) {
    return response;
  }

  let html = await response.text();

  const t0 = performance.now();

  // HTML CLASS
  const currentTheme = getCookieTheme(cookies) ?? "auto";
  html = html.replace(
    PostProcessingTags.HTML_CLASS,
    currentTheme === "dark" ? "dark-theme" : currentTheme === "light" ? "light-theme" : ""
  );

  // PRICES
  html = html.replaceAll(priceRegex, (_, priceString) => {
    const unescapedString = priceString.replaceAll("&quot;", '"');
    const price = JSON.parse(unescapedString) as PostProcessingPrice;

    if (price.amount === 0) {
      return t("collectibles.price.free");
    }

    if (currentCurrency === price.currency) {
      return formatPrice(price);
    }

    const convertedPrice = {
      amount: convert(price.currency, currentCurrency, price.amount),
      currency: currentCurrency,
    };

    if (price.format === "long") {
      return `${formatPrice(price)} (${formatPrice(convertedPrice)})`;
    } else {
      return formatPrice(convertedPrice);
    }
  });

  // PREFERRED_CURRENCY
  html = html.replace(PostProcessingTags.PREFERRED_CURRENCY, currentCurrency.toUpperCase());

  // SELECTED CURRENCY CLASS
  html = html.replaceAll(selectedCurrencyRegex, (_, selectedCurrency) => {
    const unescapedString = selectedCurrency.replaceAll("&#34;", '"');
    const currency = JSON.parse(unescapedString) as PostProcessingCurrency;

    if (currentCurrency === currency.currency) {
      return "current";
    } else {
      return "";
    }
  });

  console.log("Post-processing:", performance.now() - t0, "ms");

  return new Response(html, response);
});
