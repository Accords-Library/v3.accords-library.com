import {
  Collections,
  type EndpointAudio,
  type EndpointChronologyEvent,
  type EndpointCollectible,
  type EndpointFile,
  type EndpointFolder,
  type EndpointImage,
  type EndpointPage,
  type EndpointRecorder,
  type EndpointVideo,
} from "src/shared/payload/payload-sdk";

export enum Indexes {
  DOCUMENT = "DOCUMENT",
}

export type MeiliDocument = {
  meilid: string;
  id: string;
  languages: string[];
  title?: string;
  content?: string;
} & (
  | {
      type: Collections.Collectibles;
      data: EndpointCollectible;
    }
  | {
      type: Collections.Pages;
      data: EndpointPage;
    }
  | {
      type: Collections.Folders;
      data: EndpointFolder;
    }
  | {
      type: Collections.Videos;
      data: EndpointVideo;
    }
  | {
      type: Collections.Audios;
      data: EndpointAudio;
    }
  | {
      type: Collections.Images;
      data: EndpointImage;
    }
  | {
      type: Collections.Files;
      data: EndpointFile;
    }
  | {
      type: Collections.Recorders;
      data: EndpointRecorder;
    }
  | {
      type: Collections.ChronologyEvents;
      data: EndpointChronologyEvent;
    }
);

export type SearchResponse<T> = {
  hits: T[];
  query: string;
  processingTimeMs: number;
  hitsPerPage: number;
  page: number;
  totalPages: number;
  totalHits: number;
  facetDistribution: Record<"type" | "languages", Record<string, number>>;
};

export type SearchRequest = {
  q: string;
  page: number;
  types?: string[] | string | undefined;
};

export class Meilisearch {
  constructor(
    private readonly apiURL: string,
    private readonly bearer: string
  ) {}

  async search({ q, page, types }: SearchRequest): Promise<SearchResponse<MeiliDocument>> {
    const filter: string[] = [];

    if (types) {
      if (typeof types === "string") {
        filter.push(`type = ${types}`);
      } else {
        filter.push(`type IN [${types.join(", ")}]`);
      }
    }

    const body = {
      q,
      page,
      hitsPerPage: 25,
      filter,
      sort: ["updatedAt:desc"]
    };

    const result = await fetch(`${this.apiURL}/indexes/DOCUMENT/search`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.bearer}`,
      },
    });
    return await result.json();
  }
}
