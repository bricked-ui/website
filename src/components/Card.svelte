<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    class?: string;
    children: Snippet;
  }

  let { title, class: cls = "", children }: Props = $props();
</script>

<section class={cls ? `bk-card bk-cut ${cls}` : "bk-card bk-cut"}>
  <header class="bk-card__head">{title}</header>
  <div class="bk-card__body">
    {@render children()}
  </div>
</section>
