import currencies from "src/shared/openExchange/currencies.json";
import { rates } from "src/shared/openExchange/rates.json";

type CurrencyCode = keyof typeof rates;

export const convert = (from: string, to: string, amount: number) => {
  if (!isCurrencyCode(from)) return NaN;
  if (!isCurrencyCode(to)) return NaN;

  return (amount / rates[from]) * rates[to];
};

export const formatCurrency = (code: string) => {
  if (!isCurrencyCode(code)) return code;
  return currencies[code];
};

const isCurrencyCode = (code: string): code is CurrencyCode => code in rates;
