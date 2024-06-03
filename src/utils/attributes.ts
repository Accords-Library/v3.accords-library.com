export type Attribute = {
  icon: string;
  title: string;
  lang?: string | undefined;
  values: { name: string; href?: string | undefined; lang?: string | undefined }[];
  withBorder?: boolean | undefined;
};
