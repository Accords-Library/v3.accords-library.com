import { cache } from "src/utils/cachedPayload";

export const formatLocale = (code: string): string =>
  cache.locales.find(({ id }) => id === code)?.name ?? code;

export const formatRecorder = (recorderId: string): string => {
  const result = cache.recorders.find(({ id }) => id === recorderId);

  if (!result) {
    return "UNKNOWN";
  }

  return result.username;
};
