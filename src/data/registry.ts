// Registry catalog, vendored from ../ui via `bun run sync-ui` so the Docs
// table and shelf coverage can never drift from what `shadcn build` publishes.
import catalog from "./registry.json";

export interface RegistryFile {
  path: string;
  type: string;
  target: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

export const registryItems = (catalog as { items: RegistryItem[] }).items;
export const componentItems = registryItems.filter(
  (i) => i.name !== "bricked-css" && i.name !== "bricked-globals"
);
