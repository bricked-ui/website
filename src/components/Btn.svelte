<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../lib/utils";
  import PixelIcon from "./pixel-icon.svelte";
  import type { PixelIconInput } from "./icons.js";

  interface Props {
    icon?: PixelIconInput;
    size?: "sm" | "lg";
    disabled?: boolean;
    class?: string;
    onclick?: () => void;
    children?: Snippet;
  }

  let {
    icon,
    size,
    disabled = false,
    class: cls = "",
    onclick,
    children,
  }: Props = $props();
</script>

<button
  type="button"
  class={cn("bricked-btn", size && `bricked-btn--${size}`, cls)}
  {disabled}
  {onclick}
>
  {#if icon}<PixelIcon icon={icon} />{/if}
  {#if children}<span>{@render children()}</span>{/if}
</button>
