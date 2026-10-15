<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    open?: boolean;
    onClose?: () => void;
    children: Snippet;
  }

  let { title, open = $bindable(false), onClose, children }: Props = $props();
  let el: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  });

  function close() {
    open = false;
    onClose?.();
  }
</script>

<dialog
  bind:this={el}
  class="bk-modal bk-cut"
  aria-label={title}
  onclose={close}
  onclick={(e) => {
    if (e.target === e.currentTarget) el?.close();
  }}
>
  <header class="bk-card__head bk-modal__head">{title}</header>
  <div class="bk-card__body">
    {@render children()}
  </div>
</dialog>
