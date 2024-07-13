import { AnalyticsSDK } from "src/shared/analytics/sdk";
import { MeilisearchSDK } from "src/shared/meilisearch/sdk";

export const meilisearch = new MeilisearchSDK(
  import.meta.env.MEILISEARCH_URL,
  import.meta.env.MEILISEARCH_MASTER_KEY
);

export const analytics = new AnalyticsSDK(import.meta.env.ANALYTICS_URL);
