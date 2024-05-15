export type Attribute = {
  icon: string;
  title: string;
  values: { name: string; href?: string }[];
  withBorder?: boolean | undefined;
};
