<script lang="ts">
  import CopyButton from "../components/CopyButton.svelte";

  type Pm = "bun" | "npm" | "pnpm" | "yarn";

  interface Props {
    build: (run: string) => string;
  }

  let { build }: Props = $props();

  const RUNNERS: Record<Pm, string> = {
    bun: "bunx",
    npm: "npx",
    pnpm: "pnpm dlx",
    yarn: "yarn dlx",
  };

  let pm = $state<Pm>("bun");
  const full = $derived(build(RUNNERS[pm]));
  const head = $derived(full.split(" ")[0]);
</script>

<div class="bk-tabs" role="tablist" aria-label="Package manager">
  {#each Object.keys(RUNNERS) as p}
    <button
      type="button"
      role="tab"
      aria-selected={pm === p}
      class="bk-tab bk-cut"
      onclick={() => (pm = p as Pm)}
    >
      {p}
    </button>
  {/each}
</div>
<div class="doc-code" style="margin-top: 8px;">
  <CopyButton text={full} />
  {#each full.split("\n") as line, i}
    {#if i > 0}<br />{/if}<b>{head}</b>{line.slice(head.length)}
  {/each}
</div>
