import {
  payload,
  type EndpointKey,
  type EndpointRecorder,
  type Language,
  type EndpointTag,
  type EndpointTagsGroup,
  type EndpointWording,
} from "src/shared/payload/payload-sdk";

type Cache = {
  locales: Language[];
  currencies: string[];
  keys: EndpointKey[];
  recorders: EndpointRecorder[];
  tags: EndpointTag[];
  tagsGroups: EndpointTagsGroup[];
  wordings: EndpointWording[];
};

const fetchNewData = async (): Promise<Cache> => ({
  locales: await payload.getLanguages(),
  currencies: (await payload.getCurrencies()).map(({ id }) => id),
  keys: await payload.getKeys(),
  recorders: await payload.getRecorders(),
  tags: await payload.getTags(),
  tagsGroups: await payload.getTagsGroups(),
  wordings: await payload.getWordings(),
});

export let cache = await fetchNewData();

setInterval(async () => {
  console.log("Refreshing cached Payload data");
  cache = await fetchNewData();
}, 1000_000);
