<script lang="ts">
  import CodeBlock from "../components/CodeBlock.svelte";

  interface SourceFile {
    path: string;
    content?: string;
  }

  interface Props {
    name: string;
  }

  let { name }: Props = $props();
  let files = $state<SourceFile[] | null>(null);
  let failed = $state(false);

  $effect(() => {
    let live = true;
    files = null;
    failed = false;
    fetch(`${import.meta.env.BASE_URL}r/${name}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (live) files = d.files ?? [];
      })
      .catch(() => {
        if (live) failed = true;
      });
    return () => {
      live = false;
    };
  });
</script>

{#if failed}
  <p>Could not load the source — use the CLI command instead.</p>
{:else if !files}
  <p>Loading source…</p>
{:else}
  <div class="src-code" style="max-height: 480px; overflow: auto;">
    {#each files as f (f.path)}
      <div style="margin-bottom: 12px;">
        <p style="margin: 0 0 4px;">
          <code class="text-sm">{f.path.split("/").pop()}</code>
        </p>
        <CodeBlock text={f.content ?? ""}>
          {f.content ?? ""}
        </CodeBlock>
      </div>
    {/each}
    <p>
      Paste each file into the matching path in your repo, install any listed
      dependencies, done.
    </p>
  </div>
{/if}
