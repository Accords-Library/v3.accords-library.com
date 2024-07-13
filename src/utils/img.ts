import type { PayloadImage } from "src/shared/payload/endpoint-types";

export const sizesToSrcset = (sizes: PayloadImage[]): string =>
  sizes.map(({ url, width }) => `${encodeURI(url)} ${width}w`).join(", ");

export const sizesForGridLayout = (targetSize: number, marginMultiplier: number) => `
(max-width: ${targetSize * 2 * marginMultiplier}px) ${100 / 1}vw,
(max-width: ${targetSize * 3 * marginMultiplier}px) ${100 / 2}vw,
(max-width: ${targetSize * 4 * marginMultiplier}px) ${100 / 3}vw,
${targetSize}px`;
