export type Attribute = {
  icon: string;
  title: string;
  lang?: string | undefined;
  values: { name: string; href?: string | undefined; lang?: string | undefined }[];
  withBorder?: boolean | undefined;
};

export const getFileIcon = (mimeType: string): string => {
  const firstPart = mimeType.split("/")[0];

  switch (firstPart) {
    case "video":
      return "material-symbols:video-file";

    case "image":
      return "image-file";

    case "audio":
      return "material-symbols:audio-file";
  }

  switch (mimeType) {
    case "application/zip":
      return "material-symbols:folder-zip";

    case "application/pdf":
      return "pdf-file";
  }

  return "material-symbols:unknown-document";
};
