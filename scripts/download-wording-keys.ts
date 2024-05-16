import { writeFileSync } from "fs";
import { payload } from "src/utils/payload";

const TRANSLATION_FOLDER = `${process.cwd()}/src/i18n`;

try {
  const wordings = await payload.getWordings();
  const keys = wordings.map(({ name }) => name);

  let result = "";
  result += "export type WordingKey =\n";
  result += `  | "` + keys.join(`"\n  | "`) + `";\n`;

  writeFileSync(`${TRANSLATION_FOLDER}/wordings-keys.ts`, result, {
    encoding: "utf-8",
  });
} catch (e) {
  console.error("Failed to get the sdk", e);
}
