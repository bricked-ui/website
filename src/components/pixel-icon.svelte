<script lang="ts">
  import {
    resolvePixelGrid,
    type PixelIconGrid,
    type PixelIconInput,
    type PixelIconName,
  } from "./icons.js";

  interface Props {
    /** Registry icon name. Kept for back-compat — `icon` does the same plus custom grids. */
    name?: PixelIconName;
    /** Custom pixel grid. Wins over `icon`/`name` when provided. */
    grid?: PixelIconGrid;
    /** Registry name or custom grid. Wins over `name` when provided. */
    icon?: PixelIconInput;
    class?: string;
  }

  let { name, grid, icon, class: cls = "" }: Props = $props();

  const resolved = $derived(
    grid ??
      (icon !== undefined ? resolvePixelGrid(icon) : undefined) ??
      (name ? resolvePixelGrid(name) : undefined)
  );
  const cols = $derived(
    resolved ? Math.max(...resolved.map((r) => r.length)) : 0
  );
  const rows = $derived(resolved ? resolved.length : 0);

  /** Merge each row's filled cells into horizontal runs → one compact path per grid. */
  const pathCache = new WeakMap<readonly string[], string>();
  function gridPath(grid: readonly string[]): string {
    let d = pathCache.get(grid);
    if (d !== undefined) return d;
    const parts: string[] = [];
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      let x = 0;
      while (x < row.length) {
        if (row[x] === "1") {
          let len = 1;
          while (row[x + len] === "1") len++;
          parts.push(`M${x} ${y}h${len}v1h-${len}z`);
          x += len;
        } else x++;
      }
    }
    d = parts.join("");
    pathCache.set(grid, d);
    return d;
  }
  const d = $derived(resolved ? gridPath(resolved) : "");
</script>

{#if resolved}
  <svg
    class="bricked-icon {cls}"
    style="width: calc(var(--icon, 4px) * {cols}); height: calc(var(--icon, 4px) * {rows});"
    viewBox="0 0 {cols} {rows}"
    shape-rendering="crispEdges"
    aria-hidden="true"
  >
    <path {d} fill="currentColor" />
  </svg>
{/if}
