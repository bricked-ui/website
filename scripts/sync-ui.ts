// Refreshes the files website vendors from ../ui (the single source of
// truth for the registry). Run: bun run sync-ui
// Vendored: registry catalog (Docs table + shelf coverage), PixelIcon +
// its icons grid (Svelte), and the Svelte component inventory.
import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ui = resolve(root, "..", "ui");

mkdirSync(resolve(root, "src/data"), { recursive: true });
mkdirSync(resolve(root, "src/components"), { recursive: true });

copyFileSync(resolve(ui, "registry.json"), resolve(root, "src/data/registry.json"));
copyFileSync(
  resolve(ui, "svelte/src/lib/components/pixel-icon.svelte"),
  resolve(root, "src/components/pixel-icon.svelte")
);
copyFileSync(
  resolve(ui, "svelte/src/lib/components/icons.ts"),
  resolve(root, "src/components/icons.ts")
);

const dir = resolve(ui, "svelte/src/lib/components");
const svelte = readdirSync(dir)
  .filter((f) => f.endsWith(".svelte"))
  .map((f) => f.replace(/\.svelte$/, ""))
  .sort();
writeFileSync(
  resolve(root, "src/data/svelte.json"),
  JSON.stringify({ count: svelte.length, components: svelte }, null, 2) + "\n"
);

console.log(
  `synced src/data/registry.json + src/components/pixel-icon.svelte + icons.ts + src/data/svelte.json (${svelte.length} components) from ../ui`
);
