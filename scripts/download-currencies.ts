import { writeFileSync } from "fs";

const OPEN_EXCHANGE_FOLDER = `${process.cwd()}/src/shared/openExchange`;

const ratesUrl = `https://openexchangerates.org/api/latest.json?app_id=${
  import.meta.env.OER_APP_ID
}`;
const currenciesUrl = `https://openexchangerates.org/api/currencies.json?app_id=${
  import.meta.env.OER_APP_ID
}`;

const rates = await fetch(ratesUrl);

if (rates.ok) {
  writeFileSync(`${OPEN_EXCHANGE_FOLDER}/rates.json`, await rates.text(), {
    encoding: "utf-8",
  });
} else {
  console.error("Failed to get the rates", rates.status, rates.statusText);
}

const currencies = await fetch(currenciesUrl);

if (currencies.ok) {
  writeFileSync(
    `${OPEN_EXCHANGE_FOLDER}/currencies.json`,
    await currencies.text(),
    {
      encoding: "utf-8",
    }
  );
} else {
  console.error(
    "Failed to get the currencies",
    currencies.status,
    currencies.statusText
  );
}
