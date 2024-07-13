// @ts-check
import { writeFileSync, readFileSync, existsSync } from "fs";

const OPEN_EXCHANGE_FOLDER = `${process.cwd()}/src/dist/openExchange`;
const RATE_JSON_PATH = `${OPEN_EXCHANGE_FOLDER}/rates.json`;
const CURRENCIES_JSON_PATH = `${OPEN_EXCHANGE_FOLDER}/currencies.json`;
const ONE_DAY_IN_MS = 1_000 * 60 * 60 * 24;

if (existsSync(RATE_JSON_PATH)) {
  const rateBuffer = readFileSync(RATE_JSON_PATH, { encoding: "utf-8" });
  const rateJSON = JSON.parse(rateBuffer);
  const timestamp = rateJSON.timestamp * 1000;
  const diff = Date.now() - timestamp;

  if (diff < ONE_DAY_IN_MS) {
    console.log("Currencies and rates are already up to date");
    process.exit();
  }
}

if (!process.env.OER_APP_ID) {
  throw new Error("Missing OER_APP_ID env variable");
}

const ratesUrl = `https://openexchangerates.org/api/latest.json?app_id=${process.env.OER_APP_ID}`;
const currenciesUrl = `https://openexchangerates.org/api/currencies.json?app_id=${
  process.env.OER_APP_ID
}`;

const rates = await fetch(ratesUrl);

if (rates.ok) {
  writeFileSync(RATE_JSON_PATH, await rates.text(), {
    encoding: "utf-8",
  });
} else {
  console.error("Failed to get the rates", rates.status, rates.statusText);
}

const currencies = await fetch(currenciesUrl);

if (currencies.ok) {
  writeFileSync(CURRENCIES_JSON_PATH, await currencies.text(), {
    encoding: "utf-8",
  });
} else {
  console.error("Failed to get the currencies", currencies.status, currencies.statusText);
}
