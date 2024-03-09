import { payload, type Language, type EndpointWording } from "src/shared/payload/payload-sdk";

type Cache = {
  locales: Language[];
  currencies: string[];
  wordings: EndpointWording[];
};

const fetchNewData = async (): Promise<Cache> => ({
  locales: await payload.getLanguages(),
  currencies: (await payload.getCurrencies()).map(({ id }) => id),
  wordings: await payload.getWordings(),
});

export let cache = await fetchNewData();

export const refreshWordings = async () => {
  cache.wordings = await payload.getWordings();
};

setInterval(async () => {
  console.log("Refreshing cached Payload data");
  cache = await fetchNewData();
}, 1000_000);
