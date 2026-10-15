<script lang="ts">
  interface Props {
    text: string;
    small?: boolean;
  }

  let { text, small = false }: Props = $props();
  let done = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable — still flip the label */
    }
    done = true;
    clearTimeout(timer);
    timer = setTimeout(() => (done = false), 1500);
  }
</script>

<button
  type="button"
  class={small ? "bricked-btn bricked-btn--sm" : "doc-copy"}
  onclick={copy}
>
  <span>{done ? "Copied" : "Copy"}</span>
</button>
