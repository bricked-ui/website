import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
