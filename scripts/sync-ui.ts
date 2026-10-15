// Refreshes the files website vendors from ../ui (the single source of
// truth for the registry). Run: bun run sync-ui
// Vendored: registry catalog (Docs table + shelf coverage) and PixelIcon.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ui = resolve(root, "..", "ui");

mkdirSync(resolve(root, "src/data"), { recursive: true });
mkdirSync(resolve(root, "src/components"), { recursive: true });

copyFileSync(resolve(ui, "registry.json"), resolve(root, "src/data/registry.json"));
copyFileSync(
  resolve(ui, "registry/bricked-ui/pixel-icon.tsx"),
  resolve(root, "src/components/PixelIcon.tsx")
);

console.log("synced src/data/registry.json + src/components/PixelIcon.tsx from ../ui");
