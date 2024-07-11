import { Meilisearch } from "src/shared/meilisearch/meilisearch-sdk";

export const meilisearch = new Meilisearch(
  import.meta.env.MEILISEARCH_URL,
  import.meta.env.MEILISEARCH_MASTER_KEY
);
