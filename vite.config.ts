import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  // The site is self-contained: styles, icons and registry data are vendored
  // under src/ (refresh with `bun run sync-ui`). dist/ needs no ../ui.
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: { "@": "/src" },
  },
});
