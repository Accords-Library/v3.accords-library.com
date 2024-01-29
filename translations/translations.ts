export const getI18n = async (locale: string) => {
  const file = Bun.file(`./translations/${locale}.json`, {
    type: "application/json",
  });
  const content = await file.text();
  const translations: Record<string, string> = JSON.parse(content);

  return {
    t: (key: string): string => {
      if (key in translations) {
        return translations[key]!;
      }
      return `MISSING KEY: ${key}`;
    },
  };
};
