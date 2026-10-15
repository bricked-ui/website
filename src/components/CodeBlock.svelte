<script lang="ts">
  import type { Snippet } from "svelte";
  import CopyButton from "./CopyButton.svelte";

  interface Props {
    text: string;
    children: Snippet;
  }

  let { text, children }: Props = $props();
</script>

<div class="doc-code">
  <CopyButton {text} />
  <div style="white-space: pre-wrap; overflow-wrap: anywhere;" class="text-sm">
    {@render children()}
  </div>
</div>
