<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    tag: string;
    class?: string;
    children: Snippet;
  }

  let { tag, class: cls = "", children }: Props = $props();
</script>

<figure class={cls ? `demo ${cls}` : "demo"}>
  <figcaption>
    <span class="demo-tag">{tag}</span>
  </figcaption>
  {@render children()}
</figure>
