<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../lib/utils";
  import PixelIcon from "./pixel-icon.svelte";
  import type { PixelIconName } from "./icons.js";

  interface Props {
    icon?: PixelIconName;
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
  {#if icon}<PixelIcon name={icon} />{/if}
  {#if children}<span>{@render children()}</span>{/if}
</button>
