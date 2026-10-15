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

// Svelte port lives at ui/svelte/src/lib. The website doesn't render
// Svelte, but Docs links to it — keep a record of which Svelte pieces
// exist so the Svelte coverage note stays honest without a build step.
try {
  const { readdirSync } = await import("node:fs");
  const dir = resolve(ui, "svelte/src/lib/components");
  const svelte = readdirSync(dir)
    .filter((f) => f.endsWith(".svelte"))
    .map((f) => f.replace(/\.svelte$/, ""))
    .sort();
  const { writeFileSync } = await import("node:fs");
  writeFileSync(
    resolve(root, "src/data/svelte.json"),
    JSON.stringify({ count: svelte.length, components: svelte }, null, 2) + "\n"
  );
  console.log(`synced src/data/svelte.json (${svelte.length} components) from ../ui/svelte`);
} catch {
  console.log("skipped svelte inventory (ui/svelte not found)");
}

console.log("synced src/data/registry.json + src/components/PixelIcon.tsx from ../ui");
