/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "RecorderBiographies".
 */
export type RecorderBiographies =
  | {
      language: string | Language;
      biography: {
        root: {
          children: {
            type: string;
            version: number;
            [k: string]: unknown;
          }[];
          direction: ("ltr" | "rtl") | null;
          format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
          indent: number;
          type: string;
          version: number;
        };
        [k: string]: unknown;
      };
      id?: string | null;
    }[]
  | null;
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CategoryTranslations".
 */
export type CategoryTranslations = {
  language: string | Language;
  name: string;
  id?: string | null;
}[];

export interface Config {
  collections: {
    pages: Page;
    collectibles: Collectible;
    folders: Folder;
    "chronology-events": ChronologyEvent;
    notes: Note;
    images: Image;
    "background-images": BackgroundImage;
    "recorders-thumbnails": RecordersThumbnail;
    videos: Video;
    "videos-channels": VideosChannel;
    tags: Tag;
    "tags-groups": TagsGroup;
    recorders: Recorder;
    languages: Language;
    currencies: Currency;
    wordings: Wording;
    "generic-contents": GenericContent;
    "payload-preferences": PayloadPreference;
    "payload-migrations": PayloadMigration;
  };
  globals: {
    "home-folders": HomeFolder;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  slug: string;
  type: "Content" | "Post" | "Generic";
  thumbnail?: string | Image | null;
  backgroundImage?: string | BackgroundImage | null;
  tags?: (string | Tag)[] | null;
  authors?: (string | Recorder)[] | null;
  translations: {
    language: string | Language;
    sourceLanguage: string | Language;
    pretitle?: string | null;
    title: string;
    subtitle?: string | null;
    summary?: {
      root: {
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        type: string;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    content: {
      root: {
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        type: string;
        version: number;
      };
      [k: string]: unknown;
    };
    transcribers?: (string | Recorder)[] | null;
    translators?: (string | Recorder)[] | null;
    proofreaders?: (string | Recorder)[] | null;
    id?: string | null;
  }[];
  folders?: (string | Folder)[] | null;
  collectibles?: (string | Collectible)[] | null;
  updatedBy: string | Recorder;
  updatedAt: string;
  createdAt: string;
  _status?: ("draft" | "published") | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "images".
 */
export interface Image {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumb?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    og?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "background-images".
 */
export interface BackgroundImage {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumb?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tags".
 */
export interface Tag {
  id: string;
  name?: string | null;
  slug: string;
  translations: {
    language: string | Language;
    name: string;
    id?: string | null;
  }[];
  group: string | TagsGroup;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "languages".
 */
export interface Language {
  id: string;
  name: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tags-groups".
 */
export interface TagsGroup {
  id: string;
  slug: string;
  icon?: string | null;
  translations: {
    language: string | Language;
    name: string;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "recorders".
 */
export interface Recorder {
  id: string;
  username: string;
  avatar?: string | RecordersThumbnail | null;
  languages?: (string | Language)[] | null;
  biographies?: RecorderBiographies;
  role?: ("Admin" | "Recorder" | "Api")[] | null;
  anonymize: boolean;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "recorders-thumbnails".
 */
export interface RecordersThumbnail {
  id: string;
  recorder?: (string | null) | Recorder;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumb?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    square?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "folders".
 */
export interface Folder {
  id: string;
  slug: string;
  icon?: string | null;
  parentFolders?: (string | Folder)[] | null;
  translations: {
    language: string | Language;
    name: string;
    description?: {
      root: {
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        type: string;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    id?: string | null;
  }[];
  sections?:
    | {
        translations?:
          | {
              language: string | Language;
              name: string;
              id?: string | null;
            }[]
          | null;
        subfolders?: (string | Folder)[] | null;
        id?: string | null;
      }[]
    | null;
  files?:
    | (
        | {
            relationTo: "collectibles";
            value: string | Collectible;
          }
        | {
            relationTo: "pages";
            value: string | Page;
          }
      )[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "collectibles".
 */
export interface Collectible {
  id: string;
  slug: string;
  thumbnail?: string | Image | null;
  nature: "Physical" | "Digital";
  languages?: (string | Language)[] | null;
  tags?: (string | Tag)[] | null;
  translations: {
    language: string | Language;
    pretitle?: string | null;
    title: string;
    subtitle?: string | null;
    description?: {
      root: {
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        type: string;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    id?: string | null;
  }[];
  backgroundImage?: string | BackgroundImage | null;
  gallery?:
    | {
        image: string | Image;
        id?: string | null;
      }[]
    | null;
  scansEnabled?: boolean | null;
  scans?: {
    scanners: (string | Recorder)[];
    cleaners: (string | Recorder)[];
    typesetters?: (string | Recorder)[] | null;
    coverEnabled?: boolean | null;
    cover?: {
      front?: string | Image | null;
      spine?: string | Image | null;
      back?: string | Image | null;
      insideFront?: string | Image | null;
      insideBack?: string | Image | null;
      flapFront?: string | Image | null;
      flapBack?: string | Image | null;
      insideFlapFront?: string | Image | null;
      insideFlapBack?: string | Image | null;
    };
    dustjacketEnabled?: boolean | null;
    dustjacket?: {
      front?: string | Image | null;
      spine?: string | Image | null;
      back?: string | Image | null;
      insideFront?: string | Image | null;
      insideSpine?: string | Image | null;
      insideBack?: string | Image | null;
      flapFront?: string | Image | null;
      flapBack?: string | Image | null;
      insideFlapFront?: string | Image | null;
      insideFlapBack?: string | Image | null;
    };
    obiEnabled?: boolean | null;
    obi?: {
      front?: string | Image | null;
      spine?: string | Image | null;
      back?: string | Image | null;
      insideFront?: string | Image | null;
      insideSpine?: string | Image | null;
      insideBack?: string | Image | null;
      flapFront?: string | Image | null;
      flapBack?: string | Image | null;
      insideFlapFront?: string | Image | null;
      insideFlapBack?: string | Image | null;
    };
    pages?:
      | {
          page: number;
          image: string | Image;
          id?: string | null;
        }[]
      | null;
  };
  urls?:
    | {
        url: string;
        id?: string | null;
      }[]
    | null;
  releaseDate?: string | null;
  priceEnabled?: boolean | null;
  price?: {
    amount: number;
    currency: string | Currency;
  };
  sizeEnabled?: boolean | null;
  size?: {
    width: number;
    height: number;
    thickness?: number | null;
  };
  weightEnabled?: boolean | null;
  weight?: {
    amount: number;
  };
  pageInfoEnabled?: boolean | null;
  pageInfo?: {
    pageCount: number;
    bindingType?: ("Paperback" | "Hardcover") | null;
    pageOrder?: ("Left to right" | "Right to left") | null;
  };
  folders?: (string | Folder)[] | null;
  parentItems?: (string | Collectible)[] | null;
  subitems?: (string | Collectible)[] | null;
  contents?:
    | {
        content:
          | {
              relationTo: "pages";
              value: string | Page;
            }
          | {
              relationTo: "generic-contents";
              value: string | GenericContent;
            };
        range?:
          | (
              | {
                  start: number;
                  end: number;
                  id?: string | null;
                  blockName?: string | null;
                  blockType: "pageRange";
                }
              | {
                  start: string;
                  end: string;
                  id?: string | null;
                  blockName?: string | null;
                  blockType: "timeRange";
                }
              | {
                  translations?:
                    | {
                        language: string | Language;
                        note: {
                          root: {
                            children: {
                              type: string;
                              version: number;
                              [k: string]: unknown;
                            }[];
                            direction: ("ltr" | "rtl") | null;
                            format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
                            indent: number;
                            type: string;
                            version: number;
                          };
                          [k: string]: unknown;
                        };
                        id?: string | null;
                      }[]
                    | null;
                  id?: string | null;
                  blockName?: string | null;
                  blockType: "other";
                }
            )[]
          | null;
        id?: string | null;
      }[]
    | null;
  updatedBy: string | Recorder;
  updatedAt: string;
  createdAt: string;
  _status?: ("draft" | "published") | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "currencies".
 */
export interface Currency {
  id: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "generic-contents".
 */
export interface GenericContent {
  id: string;
  name: string;
  translations: {
    language: string | Language;
    name: string;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "chronology-events".
 */
export interface ChronologyEvent {
  id: string;
  name?: string | null;
  date: {
    year: number;
    month?: number | null;
    day?: number | null;
  };
  events: {
    sources?: (UrlBlock | CollectibleBlock | PageBlock)[] | null;
    translations: {
      language: string | Language;
      sourceLanguage: string | Language;
      title?: string | null;
      description?: {
        root: {
          children: {
            type: string;
            version: number;
            [k: string]: unknown;
          }[];
          direction: ("ltr" | "rtl") | null;
          format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
          indent: number;
          type: string;
          version: number;
        };
        [k: string]: unknown;
      } | null;
      notes?: {
        root: {
          children: {
            type: string;
            version: number;
            [k: string]: unknown;
          }[];
          direction: ("ltr" | "rtl") | null;
          format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
          indent: number;
          type: string;
          version: number;
        };
        [k: string]: unknown;
      } | null;
      transcribers?: (string | Recorder)[] | null;
      translators?: (string | Recorder)[] | null;
      proofreaders?: (string | Recorder)[] | null;
      id?: string | null;
    }[];
    id?: string | null;
  }[];
  updatedBy: string | Recorder;
  updatedAt: string;
  createdAt: string;
  _status?: ("draft" | "published") | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "UrlBlock".
 */
export interface UrlBlock {
  url: string;
  id?: string | null;
  blockName?: string | null;
  blockType: "urlBlock";
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CollectibleBlock".
 */
export interface CollectibleBlock {
  collectible: string | Collectible;
  range?:
    | (
        | {
            page: number;
            id?: string | null;
            blockName?: string | null;
            blockType: "page";
          }
        | {
            timestamp: string;
            id?: string | null;
            blockName?: string | null;
            blockType: "timestamp";
          }
        | {
            translations: {
              language: string | Language;
              note: string;
              id?: string | null;
            }[];
            id?: string | null;
            blockName?: string | null;
            blockType: "other";
          }
      )[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "collectibleBlock";
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "PageBlock".
 */
export interface PageBlock {
  page: string | Page;
  id?: string | null;
  blockName?: string | null;
  blockType: "pageBlock";
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "notes".
 */
export interface Note {
  id: string;
  note: {
    root: {
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      type: string;
      version: number;
    };
    [k: string]: unknown;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "videos".
 */
export interface Video {
  id: string;
  uid: string;
  gone: boolean;
  source: "YouTube" | "NicoNico" | "Tumblr";
  title: string;
  description?: string | null;
  likes?: number | null;
  views?: number | null;
  publishedDate: string;
  channel?: (string | null) | VideosChannel;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "videos-channels".
 */
export interface VideosChannel {
  id: string;
  uid: string;
  title: string;
  subscribers?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "wordings".
 */
export interface Wording {
  id: string;
  name: string;
  translations: CategoryTranslations;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: "recorders";
    value: string | Recorder;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "home-folders".
 */
export interface HomeFolder {
  id: string;
  folders?:
    | {
        lightThumbnail?: string | Image | null;
        darkThumbnail?: string | Image | null;
        folder: string | Folder;
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "LineBlock".
 */
export interface LineBlock {
  content: {
    root: {
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      type: string;
      version: number;
    };
    [k: string]: unknown;
  };
  blockType: "lineBlock";
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CueBlock".
 */
export interface CueBlock {
  content: {
    root: {
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      type: string;
      version: number;
    };
    [k: string]: unknown;
  };
  blockType: "cueBlock";
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "TranscriptBlock".
 */
export interface TranscriptBlock {
  lines: (LineBlock | CueBlock)[];
  id?: string | null;
  blockName?: string | null;
  blockType: "transcriptBlock";
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "BreakBlock".
 */
export interface BreakBlock {
  type: "Scene break" | "Empty space" | "Solid line" | "Dotted line";
  id?: string | null;
  blockName?: string | null;
  blockType: "breakBlock";
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "SectionBlock".
 */
export interface SectionBlock {
  content: {
    root: {
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      type: string;
      version: number;
    };
    [k: string]: unknown;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "sectionBlock";
}


/////////////// CONSTANTS ///////////////


export enum Collections {
  ChronologyEvents = "chronology-events",
  Currencies = "currencies",
  Files = "files",
  Languages = "languages",
  Notes = "notes",
  Pages = "pages",
  PagesThumbnails = "pages-thumbnails",
  Recorders = "recorders",
  RecordersThumbnails = "recorders-thumbnails",
  VideosChannels = "videos-channels",
  Videos = "videos",
  Folders = "folders",
  Tags = "tags",
  TagsGroups = "tags-groups",
  Images = "images",
  Wordings = "wordings",
  Collectibles = "collectibles",
  GenericContents = "generic-contents",
  BackgroundImages = "background-images",
  HomeFolders = "home-folders",
}

export enum CollectionGroups {
  Collections = "Collections",
  Media = "Media",
  Meta = "Meta",
}

export enum LanguageCodes {
  en = "English",
  fr = "French",
  ja = "Japan",
  es = "Spanish",
  "pt-br" = "Portuguese",
  "zh" = "Chinese",
}

export enum BreakBlockType {
  sceneBreak = "Scene break",
  space = "Empty space",
  solidLine = "Solid line",
  dottedLine = "Dotted line",
}

export enum CollectibleBindingTypes {
  Paperback = "Paperback",
  Hardcover = "Hardcover",
}

export enum CollectiblePageOrders {
  LeftToRight = "Left to right",
  RightToLeft = "Right to left",
}

export enum CollectibleNature {
  Physical = "Physical",
  Digital = "Digital",
}

export enum CollectibleContentType {
  None = "None",
  Indexes = "Index-based",
  Pages = "Page-based",
}

export enum RecordersRoles {
  Admin = "Admin",
  Recorder = "Recorder",
  Api = "Api",
}

export enum CollectionStatus {
  Draft = "draft",
  Published = "published",
}

export enum VideoSources {
  YouTube = "YouTube",
  NicoNico = "NicoNico",
  Tumblr = "Tumblr",
}

export enum PageType {
  Content = "Content",
  Post = "Post",
  Generic = "Generic",
}

/* RICH TEXT */

export type RichTextContent = {
  root: {
    children: RichTextNode[];
    direction: ("ltr" | "rtl") | null;
    format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
    indent: number;
    type: string;
    version: number;
  };
  [k: string]: unknown;
};

export type RichTextNode = {
  type: string;
  version: number;
  [k: string]: unknown;
};

export interface RichTextNodeWithChildren extends RichTextNode {
  children: RichTextNode[];
}

export interface RichTextParagraphNode extends RichTextNodeWithChildren {
  type: "paragraph";
  format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
}

export interface RichTextListNode extends RichTextNode {
  type: "list";
  children: RichTextNodeWithChildren[];
  listType: string;
}

export interface RichTextListNumberNode extends RichTextListNode {
  listType: "number";
}

export interface RichTextListBulletNode extends RichTextListNode {
  listType: "bullet";
}

export interface RichTextListCheckNode extends RichTextListNode {
  listType: "check";
}

export interface RichTextLinebreakNode extends RichTextNode {
  type: "linebreak";
}

export interface RichTextUploadNode extends RichTextNode {
  type: "upload";
  relationTo: string;
}

export interface RichTextUploadImageNode extends RichTextUploadNode {
  relationTo: "images" | "background-images";
  value: Image;
}

export interface RichTextTextNode extends RichTextNode {
  type: "text";
  format: number;
  text: string;
}

export interface RichTextTabNode extends RichTextNode {
  type: "tab";
  format: number;
}

export interface RichTextLinkNode extends RichTextNodeWithChildren {
  type: "link";
  fields: {
    linkType: "internal" | "custom";
  };
}

export interface RichTextLinkInternalNode extends RichTextLinkNode {
  fields: {
    linkType: "internal";
    newTab: boolean;
    doc: {
      relationTo: string;
      value: any;
    };
  };
}

export interface RichTextLinkCustomNode extends RichTextLinkNode {
  fields: {
    linkType: "custom";
    newTab: boolean;
    url: string;
  };
}

export interface RichTextBlockNode extends RichTextNode {
  type: "block";
  fields: {
    blockType: string;
  };
}

export interface RichTextSectionBlock extends RichTextBlockNode {
  fields: SectionBlock;
  anchorHash: string;
}

export interface RichTextTranscriptBlock extends RichTextBlockNode {
  fields: TranscriptBlock;
}

export interface RichTextBreakBlock extends RichTextBlockNode {
  fields: BreakBlock;
  anchorHash: string;
}

export const isNodeParagraphNode = (node: RichTextNode): node is RichTextParagraphNode =>
  node.type === "paragraph";

export const isNodeUploadNode = (node: RichTextNode): node is RichTextUploadNode =>
  node.type === "upload";

export const isUploadNodeImageNode = (node: RichTextUploadNode): node is RichTextUploadImageNode =>
  node.relationTo === "images" || node.relationTo === "background-images";

export const isNodeListNode = (node: RichTextNode): node is RichTextListNode =>
  node.type === "list";

export const isListNodeNumberListNode = (node: RichTextListNode): node is RichTextListNumberNode =>
  node.listType === "number";

export const isListNodeBulletListNode = (node: RichTextListNode): node is RichTextListBulletNode =>
  node.listType === "bullet";

export const isListNodeCheckListNode = (node: RichTextListNode): node is RichTextListCheckNode =>
  node.listType === "check";

export const isNodeLinebreakNode = (node: RichTextNode): node is RichTextLinebreakNode =>
  node.type === "linebreak";

export const isNodeTextNode = (node: RichTextNode): node is RichTextTextNode =>
  node.type === "text";

export const isNodeTabNode = (node: RichTextNode): node is RichTextTabNode => node.type === "tab";

export const isNodeLinkNode = (node: RichTextNode): node is RichTextLinkNode =>
  node.type === "link";

export const isLinkNodeInternalLinkNode = (
  node: RichTextLinkNode
): node is RichTextLinkInternalNode => node.fields.linkType === "internal";

export const isLinkNodeCustomLinkNode = (node: RichTextLinkNode): node is RichTextLinkCustomNode =>
  node.fields.linkType === "custom";

export const isNodeBlockNode = (node: RichTextNode): node is RichTextBlockNode =>
  node.type === "block";

export const isBlockNodeSectionBlock = (node: RichTextBlockNode): node is RichTextSectionBlock =>
  node.fields.blockType === "sectionBlock";

export const isBlockNodeTranscriptBlock = (
  node: RichTextBlockNode
): node is RichTextTranscriptBlock => node.fields.blockType === "transcriptBlock";

export const isBlockNodeBreakBlock = (node: RichTextBlockNode): node is RichTextBreakBlock =>
  node.fields.blockType === "breakBlock";

/* BLOCKS */

/* TODO: TO BE REMOVED WHEN https://github.com/payloadcms/payload/issues/5216 is closed */
export interface CueBlock {
  content: RichTextContent;
  blockType: "cueBlock";
  id?: string | null;
  blockName?: string | null;
}

export interface LineBlock {
  content: RichTextContent;
  blockType: "lineBlock";
  id?: string | null;
  blockName?: string | null;
}

export interface GenericBlock {
  id?: string | null;
  blockName?: string | null;
  blockType: string;
}

export const isBlockCueBlock = (block: GenericBlock): block is CueBlock =>
  block.blockType === "cueBlock";

export const isBlockLineBlock = (block: GenericBlock): block is LineBlock =>
  block.blockType === "lineBlock";


////////////////// SDK //////////////////

import NodeCache from "node-cache";


const REFRESH_FREQUENCY_IN_SEC = 60;
const CACHE = new NodeCache({
  checkperiod: REFRESH_FREQUENCY_IN_SEC,
  deleteOnExpire: true,
  forceString: true,
  maxKeys: 1,
});
const TOKEN_KEY = "token";

type PayloadLoginResponse = {
  token: string;
  exp: number;
};

const refreshToken = async () => {
  const loginUrl = payloadApiUrl(Collections.Recorders, "login");
  const loginResult = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: import.meta.env.PAYLOAD_USER,
      password: import.meta.env.PAYLOAD_PASSWORD,
    }),
  });
  logResponse(loginResult);

  if (loginResult.status !== 200) {
    throw new Error("Unable to login");
  }

  const loginJson = (await loginResult.json()) as PayloadLoginResponse;
  const { token, exp } = loginJson;
  const now = Math.floor(Date.now() / 1000);
  const ttl = Math.floor(exp - now - REFRESH_FREQUENCY_IN_SEC * 2);
  const ttlInMinutes = Math.floor(ttl / 60);
  console.log("Token was refreshed. TTL is", ttlInMinutes, "minutes.");
  CACHE.set(TOKEN_KEY, token, ttl);
  return token;
};

const getToken = async (): Promise<string> => {
  const cachedToken = CACHE.get<string>(TOKEN_KEY);
  if (cachedToken !== undefined) {
    const cachedTokenTtl = CACHE.getTtl(TOKEN_KEY) as number;
    const diffInMinutes = Math.floor((cachedTokenTtl - Date.now()) / 1000 / 60);
    console.log("Retrieved token from cache. TTL is", diffInMinutes, "minutes.");
    return cachedToken;
  }
  console.log("Refreshing token");
  return await refreshToken();
};

const injectAuth = async (init?: RequestInit): Promise<RequestInit> => ({
  ...init,
  headers: { ...init?.headers, Authorization: `JWT ${await getToken()}` },
});

const logResponse = (res: Response) => console.log(res.status, res.statusText, res.url);

const payloadApiUrl = (collection: Collections, endpoint?: string, isGlobal?: boolean): string =>
  `${import.meta.env.PAYLOAD_API_URL}/${isGlobal === undefined ? "" : "globals/"}${collection}${endpoint === undefined ? "" : `/${endpoint}`}`;

const request = async (url: string, init?: RequestInit): Promise<Response> => {
  const result = await fetch(url, await injectAuth(init));
  logResponse(result);

  if (result.status !== 200) {
    throw new Error("Unhandled fetch error");
  }

  return result;
};

// SDK and Types

export type EndpointEra = {
  slug: string;
  startingYear: number;
  endingYear: number;
  translations: {
    language: string;
    title: string;
    description?: RichTextContent;
  }[];
  items: {
    date: {
      year: number;
      month?: number;
      day?: number;
    };
    events: {
      translations: {
        language: string;
        sourceLanguage: string;
        title?: string;
        description?: RichTextContent;
        notes?: RichTextContent;
        transcribers: EndpointRecorder[];
        translators: EndpointRecorder[];
        proofreaders: EndpointRecorder[];
      }[];
    }[];
  }[];
};

export type EndpointFolderPreview = {
  slug: string;
  icon?: string;
  translations: {
    language: string;
    name: string;
    description?: RichTextContent;
  }[];
};

export type EndpointFolder = EndpointFolderPreview & {
  sections:
    | { type: "single"; subfolders: EndpointFolderPreview[] }
    | {
        type: "multiple";
        sections: {
          translations: { language: string; name: string }[];
          subfolders: EndpointFolderPreview[];
        }[];
      };
  files: (
    | {
        relationTo: "collectibles";
        value: EndpointCollectiblePreview;
      }
    | {
        relationTo: "pages";
        value: EndpointPagePreview;
      }
  )[];
  parentPages: EndpointSource[];
};

export type EndpointHomeFolder = EndpointFolderPreview & {
  lightThumbnail?: PayloadImage;
  darkThumbnail?: PayloadImage;
};

export type EndpointRecorder = {
  id: string;
  username: string;
  avatar?: PayloadImage;
  languages: string[];
  biographies: {
    language: string;
    biography: RichTextContent;
  }[];
};

export type EndpointWording = {
  name: string;
  translations: {
    language: string;
    name: string;
  }[];
};

export type EndpointTag = {
  slug: string;
  translations: {
    language: string;
    name: string;
  }[];
};

export type EndpointTagsGroup = {
  slug: string;
  icon: string;
  translations: {
    language: string;
    name: string;
  }[];
  tags: EndpointTag[];
};

export type EndpointPagePreview = {
  slug: string;
  type: PageType;
  thumbnail?: PayloadImage;
  authors: EndpointRecorder[];
  tagGroups: EndpointTagsGroup[];
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
  }[];
};

export type EndpointPage = EndpointPagePreview & {
  backgroundImage?: PayloadImage;
  translations: (EndpointPagePreview["translations"][number] & {
    sourceLanguage: string;
    summary?: RichTextContent;
    content: RichTextContent;
    transcribers: EndpointRecorder[];
    translators: EndpointRecorder[];
    proofreaders: EndpointRecorder[];
    toc: TableOfContentEntry[];
  })[];
  parentPages: EndpointSource[];
};

export type EndpointCollectiblePreview = {
  slug: string;
  thumbnail?: PayloadImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    description?: RichTextContent;
  }[];
  tagGroups: EndpointTagsGroup[];
  releaseDate?: string;
  languages: string[];
};

export type EndpointCollectible = EndpointCollectiblePreview & {
  backgroundImage?: PayloadImage;
  nature: CollectibleNature;
  gallery: PayloadImage[];
  scans: PayloadImage[];
  urls: { url: string; label: string }[];
  price?: {
    amount: number;
    currency: string;
  };
  size?: {
    width: number;
    height: number;
    thickness?: number;
  };
  weight?: number;
  pageInfo?: {
    pageCount: number;
    bindingType?: CollectibleBindingTypes;
    pageOrder?: CollectiblePageOrders;
  };
  subitems: EndpointCollectiblePreview[];
  contents: {
    content:
      | {
          relationTo: "pages";
          value: EndpointPagePreview;
        }
      | {
          relationTo: "generic-contents";
          value: {
            translations: {
              language: string;
              name: string;
            }[];
          };
        };

    range?:
      | {
          type: "pageRange";
          start: number;
          end: number;
        }
      | {
          type: "timeRange";
          start: string;
          end: string;
        }
      | {
          type: "other";
          translations: {
            language: string;
            note: RichTextContent;
          }[];
        };
  }[];
  parentPages: EndpointSource[];
};

export type TableOfContentEntry = {
  prefix: string;
  title: string;
  type: "sceneBreak" | "break" | "section";
  index: number;
  children: TableOfContentEntry[];
};

export type EndpointChronologyEvent = {
  id: string;
  date: {
    year: number;
    month?: number;
    day?: number;
  };
  events: {
    sources: EndpointSource[];
    translations: {
      language: string;
      sourceLanguage: string;
      title?: string;
      description?: RichTextContent;
      notes?: RichTextContent;
      transcribers: EndpointRecorder[];
      translators: EndpointRecorder[];
      proofreaders: EndpointRecorder[];
    }[];
  }[];
};

export type EndpointSource =
  | { type: "url"; url: string; label: string }
  | {
      type: "collectible";
      collectible: EndpointCollectiblePreview;
      range?:
        | { type: "page"; page: number }
        | { type: "timestamp"; timestamp: string }
        | { type: "custom"; translations: { language: string; note: string }[] };
    }
  | { type: "page"; page: EndpointPagePreview }
  | { type: "folder"; folder: EndpointFolderPreview };

export type PayloadImage = {
  url: string;
  width: number;
  height: number;
  mimeType: string;
  filename: string;
};

export const payload = {
  getHomeFolders: async (): Promise<EndpointHomeFolder[]> =>
    await (await request(payloadApiUrl(Collections.HomeFolders, `all`, true))).json(),
  getFolder: async (slug: string): Promise<EndpointFolder> =>
    await (await request(payloadApiUrl(Collections.Folders, `slug/${slug}`))).json(),
  getLanguages: async (): Promise<Language[]> =>
    await (await request(payloadApiUrl(Collections.Languages, `all`))).json(),
  getCurrencies: async (): Promise<Currency[]> =>
    await (await request(payloadApiUrl(Collections.Currencies, `all`))).json(),
  getWordings: async (): Promise<EndpointWording[]> =>
    await (await request(payloadApiUrl(Collections.Wordings, `all`))).json(),
  getRecorders: async (): Promise<EndpointRecorder[]> =>
    await (await request(payloadApiUrl(Collections.Recorders, `all`))).json(),
  getPage: async (slug: string): Promise<EndpointPage> =>
    await (await request(payloadApiUrl(Collections.Pages, `slug/${slug}`))).json(),
  getCollectible: async (slug: string): Promise<EndpointCollectible> =>
    await (await request(payloadApiUrl(Collections.Collectibles, `slug/${slug}`))).json(),
  getChronologyEvents: async (): Promise<EndpointChronologyEvent[]> =>
    await (await request(payloadApiUrl(Collections.ChronologyEvents, `all`))).json(),
  getChronologyEventByID: async (id: string): Promise<EndpointChronologyEvent> =>
    await (await request(payloadApiUrl(Collections.ChronologyEvents, `id/${id}`))).json(),
};
