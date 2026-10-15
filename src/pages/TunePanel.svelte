<script lang="ts">
  import CodeBlock from "../components/CodeBlock.svelte";
  import { ICONS, type PixelIconName } from "../components/icons.js";
  import { EXPORTS } from "../data/exports";

  interface Props {
    name: string;
    title: string;
  }

  let { name, title }: Props = $props();

  type Size = "sm" | "md" | "lg";
  type Variant = "primary" | "dark";

  const exp = EXPORTS[name] ?? "Component";
  let size = $state<Size>("md");
  let variant = $state<Variant>("primary");
  let icon = $state<PixelIconName | "none">("rocket");
  let iconPos = $state<"left" | "right">("left");
  let label = $state(title);
  let cls = $state("");

  const attrs = $derived(
    `size="${size}" variant="${variant}"` +
      (icon === "none" ? "" : ` icon="${icon}" iconPosition="${iconPos}"`) +
      (cls.trim() ? ` className="${cls.trim()}"` : "")
  );
  const snippet = $derived(`<${exp} ${attrs}>${label}</${exp}>`);
</script>

<div style="margin-bottom: 12px;">
  <p style="margin: 0 0 8px;">
    <code>Tune</code> — every control below is a real prop on
    <code>{exp}</code>.
  </p>
  <div class="bk-row" style="margin-bottom: 8px;">
    {#each ["sm", "md", "lg"] as s}
      <button
        type="button"
        aria-pressed={size === s}
        class={size === s ? "bk-page bk-cut is-on" : "bk-page bk-cut"}
        onclick={() => (size = s as Size)}
      >
        {s}
      </button>
    {/each}
    {#each ["primary", "dark"] as v}
      <button
        type="button"
        aria-pressed={variant === v}
        class={variant === v ? "bk-page bk-cut is-on" : "bk-page bk-cut"}
        style="width: auto; padding: 0 12px;"
        onclick={() => (variant = v as Variant)}
      >
        {v}
      </button>
    {/each}
    {#each ["left", "right"] as p}
      <button
        type="button"
        aria-label={`Icon ${p}`}
        aria-pressed={iconPos === p}
        class={iconPos === p ? "bk-page bk-cut is-on" : "bk-page bk-cut"}
        style="width: auto; padding: 0 12px;"
        onclick={() => (iconPos = p as "left" | "right")}
      >
        {p === "left" ? "←" : "→"}
      </button>
    {/each}
  </div>
  <div class="bk-row" style="margin-bottom: 8px;">
    <select
      class="bk-input bk-cut"
      aria-label="Icon"
      bind:value={icon}
      style="width: auto;"
    >
      <option value="none">no icon</option>
      {#each Object.keys(ICONS) as g}
        <option value={g}>{g}</option>
      {/each}
    </select>
    <input
      class="bk-input bk-cut"
      aria-label="Label text"
      bind:value={label}
      style="flex: 1 1 160px; min-width: 0;"
    />
    <input
      class="bk-input bk-cut"
      aria-label="Extra classes"
      placeholder="extra-class"
      bind:value={cls}
      style="flex: 1 1 160px; min-width: 0;"
    />
  </div>
  <CodeBlock text={snippet}>
    &lt;{exp} {attrs}&gt;{label}&lt;/{exp}&gt;
  </CodeBlock>
</div>
