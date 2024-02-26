import {
  payload,
  type EndpointKey,
  type EndpointRecorder,
  type Language,
} from "src/shared/payload/payload-sdk";

type Cache = {
  locales: Language[];
  currencies: string[];
  keys: EndpointKey[];
  recorders: EndpointRecorder[];
};

const fetchNewData = async (): Promise<Cache> => ({
  locales: (await payload.getLanguages()),
  currencies: (await payload.getCurrencies()).map(({ id }) => id),
  keys: await payload.getKeys(),
  recorders: await payload.getRecorders(),
});

export let cache = await fetchNewData();

setInterval(async () => {
  console.log("Refreshing cached Payload data");
  cache = await fetchNewData();
}, 1000_000);
