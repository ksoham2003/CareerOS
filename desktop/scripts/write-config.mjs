import { mkdirSync, writeFileSync } from "node:fs";

const configuredUrl = process.env.CAREEROS_WEB_URL;
if (!configuredUrl) {
  console.error("Set CAREEROS_WEB_URL to the deployed CareerOS HTTPS URL before packaging.");
  process.exit(1);
}

let applicationUrl;
try {
  applicationUrl = new URL(configuredUrl);
} catch {
  console.error("CAREEROS_WEB_URL must be a valid HTTPS URL.");
  process.exit(1);
}

if (applicationUrl.protocol !== "https:" || applicationUrl.username || applicationUrl.password) {
  console.error("CAREEROS_WEB_URL must use HTTPS and must not contain credentials.");
  process.exit(1);
}

mkdirSync(new URL("../build/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../build/app-config.json", import.meta.url),
  `${JSON.stringify({ appUrl: applicationUrl.toString() }, null, 2)}\n`,
);