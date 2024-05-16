import { writeFileSync } from "fs";

const PAYLOAD_FOLDER = `${process.cwd()}/src/shared/payload`;

const sdk = await fetch(`${import.meta.env.PAYLOAD_API_URL}/sdk`);

if (!sdk.ok) {
  console.error("Failed to get the sdk", sdk.status, sdk.statusText);
} else {
  const sdkFile = await sdk.text();
  writeFileSync(`${PAYLOAD_FOLDER}/payload-sdk.ts`, sdkFile, {
    encoding: "utf-8",
  });
}
