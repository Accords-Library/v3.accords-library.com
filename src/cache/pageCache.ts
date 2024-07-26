import { getLogger } from "src/utils/logger";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import {
  deserializeResponse,
  serializeResponse,
  type SerializableResponse,
} from "src/utils/responses";
import { SDKEndpointNames, type PayloadSDK } from "src/shared/payload/sdk";
import type { EndpointChange } from "src/shared/payload/webhooks";
import type { ContextCache } from "src/cache/contextCache";

const ON_DISK_ROOT = `.cache/pageCache`;
const ON_DISK_RESPONSE_CACHE_FILE = `${ON_DISK_ROOT}/responseCache.json`;

export class PageCache {
  private readonly logger = getLogger("[PageCache]");
  private initialized = false;

  private responseCache = new Map<string, Response>();

  private scheduleSaveTimeout: NodeJS.Timeout | undefined;

  constructor(
    private readonly uncachedPayload: PayloadSDK,
    private readonly contextCache: ContextCache
  ) {}

  async init() {
    if (this.initialized) return;

    if (import.meta.env.PAGE_PRECACHING === "true") {
      await this.precache();
    }

    this.initialized = true;
  }

  private async precache() {
    if (import.meta.env.DATA_CACHING !== "true") return;

    // Get all pages urls from CMS
    const allDocs = (await this.uncachedPayload.getAll()).data;
    const allPageUrls = allDocs.flatMap((doc) => this.getUrlFromEndpointChange(doc));
    // TODO: Add static pages likes "/" and "/settings"

    // Load cache from disk if available
    if (existsSync(ON_DISK_RESPONSE_CACHE_FILE)) {
      this.logger.log("Loading cache from disk...");

      const buffer = await readFile(ON_DISK_RESPONSE_CACHE_FILE);
      const data = JSON.parse(buffer.toString()) as [string, SerializableResponse][];
      let deserializedData = data.map<[string, Response]>(([key, value]) => [
        key,
        deserializeResponse(value),
      ]);

      // Do not include cache where the key is no longer in the CMS
      deserializedData = deserializedData.filter(([key]) => allPageUrls.includes(key));

      this.responseCache = new Map(deserializedData);
    }

    const cacheSizeBeforePrecaching = this.responseCache.size;

    for (const url of allPageUrls) {
      // Do not precache response if already included in the loaded cache from disk
      if (this.responseCache.has(url)) continue;
      try {
        await fetch(`http://${import.meta.env.ASTRO_HOST}:${import.meta.env.ASTRO_PORT}${url}`);
      } catch (e) {
        this.logger.warn("Precaching failed for page", url);
      }
    }

    if (cacheSizeBeforePrecaching !== this.responseCache.size) {
      this.scheduleSave();
    }

    this.logger.log("Precaching completed!", this.responseCache.size, "responses cached");
  }

  get(url: string): Response | undefined {
    if (import.meta.env.PAGE_CACHING !== "true") return;
    const cachedPage = this.responseCache.get(url);
    if (cachedPage) {
      this.logger.log("Retrieved cached page for", url);
      return cachedPage?.clone();
    }
    return;
  }

  set(url: string, response: Response) {
    if (import.meta.env.PAGE_CACHING !== "true") return;
    this.responseCache.set(url, response.clone());
    this.logger.log("Cached response for", url);
    if (this.initialized) {
      this.scheduleSave();
    }
  }

  private getUrlFromEndpointChange(change: EndpointChange): string[] {
    const getUnlocalizedUrl = (): string[] => {
      switch (change.type) {
        case SDKEndpointNames.getFolder:
          return [`/folders/${change.slug}`];

        case SDKEndpointNames.getCollectible:
          return [`/collectibles/${change.slug}`];

        case SDKEndpointNames.getCollectibleGallery:
          return [`/collectibles/${change.slug}/gallery`];

        case SDKEndpointNames.getCollectibleGalleryImage:
          return [`/collectibles/${change.slug}/gallery/${change.index}`];

        case SDKEndpointNames.getCollectibleScans:
          return [`/collectibles/${change.slug}/scans`];

        case SDKEndpointNames.getCollectibleScanPage:
          return [`/collectibles/${change.slug}/scans/${change.index}`];

        case SDKEndpointNames.getPage:
          return [`/pages/${change.slug}`];

        case SDKEndpointNames.getAudioByID:
          return [`/audios/${change.id}`];

        case SDKEndpointNames.getImageByID:
          return [`/images/${change.id}`];

        case SDKEndpointNames.getVideoByID:
          return [`/videos/${change.id}`];

        case SDKEndpointNames.getFileByID:
          return [`/files/${change.id}`];

        case SDKEndpointNames.getRecorderByID:
          return [`/recorders/${change.id}`];

        case SDKEndpointNames.getChronologyEvents:
        case SDKEndpointNames.getChronologyEventByID:
          return [`/timeline`];

        case SDKEndpointNames.getWebsiteConfig:
        case SDKEndpointNames.getLanguages:
        case SDKEndpointNames.getCurrencies:
        case SDKEndpointNames.getWordings:
          return [...this.responseCache.keys()];

        default:
          return [];
      }
    };

    return getUnlocalizedUrl().flatMap((url) =>
      this.contextCache.locales.map((id) => `/${id}${url}`)
    );
  }

  async invalidate(changes: EndpointChange[]) {
    if (import.meta.env.PAGE_CACHING !== "true") return;
    const pagesToInvalidate = new Set<string>(
      changes.flatMap((change) => this.getUrlFromEndpointChange(change))
    );

    for (const url of pagesToInvalidate) {
      this.responseCache.delete(url);
      this.logger.log("Invalidated cache for", url);
      try {
        await fetch(`http://${import.meta.env.ASTRO_HOST}:${import.meta.env.ASTRO_PORT}${url}`);
      } catch (e) {
        this.logger.log("Revalidation fails for", url);
      }
    }

    this.logger.log("There are currently", this.responseCache.size, "responses in cache.");
    if (this.initialized) {
      this.scheduleSave();
    }
  }

  private scheduleSave() {
    if (this.scheduleSaveTimeout) {
      clearTimeout(this.scheduleSaveTimeout);
    }
    this.scheduleSaveTimeout = setTimeout(() => {
      this.save();
    }, 10_000);
  }

  private async save() {
    if (!existsSync(ON_DISK_ROOT)) {
      await mkdir(ON_DISK_ROOT, { recursive: true });
    }

    const serializedResponses = await Promise.all(
      [...this.responseCache].map(async ([key, value]) => [key, await serializeResponse(value)])
    );
    const serializedResponseCache = JSON.stringify(serializedResponses);
    await writeFile(ON_DISK_RESPONSE_CACHE_FILE, serializedResponseCache, {
      encoding: "utf-8",
    });
    this.logger.log("Saved", ON_DISK_RESPONSE_CACHE_FILE);
  }
}
