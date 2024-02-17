import { payload } from "src/shared/payload/payload-sdk";

type Cache = {
  locales: string[];
  currencies: string[];
};

const fetchNewData = async (): Promise<Cache> => ({
  locales: (await payload.getLanguages()).map(({ id }) => id),
  currencies: (await payload.getCurrencies()).map(({ id }) => id),
});

export let cache = await fetchNewData();

setInterval(async () => {
  console.log("Refreshing cached Payload data")
  cache = await fetchNewData();
}, 1000_000);
