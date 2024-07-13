import { writeFileSync } from "fs";
import { PayloadSDK } from "src/shared/payload/sdk";

const TRANSLATION_FOLDER = `${process.cwd()}/src/i18n`;

const payload = new PayloadSDK(
  import.meta.env.PAYLOAD_API_URL,
  import.meta.env.PAYLOAD_USER,
  import.meta.env.PAYLOAD_PASSWORD
);

try {
  const { data: wordings } = await payload.getWordings();
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
