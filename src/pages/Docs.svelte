<script lang="ts">
  import CodeBlock from "../components/CodeBlock.svelte";
  import CopyButton from "../components/CopyButton.svelte";
  import { componentItems } from "../data/registry";
  import { EXPORTS } from "../data/exports";
  import InstallSnippet from "./InstallSnippet.svelte";
  import SourcePanel from "./SourcePanel.svelte";
  import TunePanel from "./TunePanel.svelte";

  const NAV: Array<[string, string]> = [
    ["installation", "Installation"],
    ["usage", "Usage"],
    ["theming", "Theming"],
    ["api", "API reference"],
    ["registry", "Registry"],
    ["cli", "CLI"],
  ];

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const TOKENS: Array<[string, string, string]> = [
    ["ink", "#2b1100", "Text, dark surfaces, focus rings on orange"],
    ["shade", "#c25a00", "Bevel shadow, sunken edges, tracks"],
    ["brick", "#ff8a1f", "Brand face, selected surfaces"],
    ["brick-hover", "#ff9a3d", "Hover face"],
    ["field", "#fff6ea", "Inputs, tracks, neutral surfaces"],
    ["peach", "#ffd3a1", "Card and modal background"],
    ["peach-deep", "#f1b97c", "Inactive tabs, pages, skeleton"],
    ["muted", "#9a6a3c", "Placeholder, secondary text"],
    ["deep", "#a24a00", "Brick mortar, switch bevel"],
    ["on-dark", "#ffd9b0", "Body text on dark surfaces"],
    ["heart", "#d63a1f", "Liked hearts only"],
  ];

  const PROPS: Array<[string, string, string]> = [
    ["size", `"sm" | "md" | "lg"`, `"md" — sets --px, --cut, --icon and the font size`],
    ["variant", `"primary" | "dark"`, `"primary" — dark flips to ink surfaces with on-dark text`],
    ["icon", `PixelIconName \| PixelIconGrid`, `none — registry name or your own 0/1 grid, rendered left or right`],
    ["iconPosition", `"left" | "right"`, `"left"`],
    ["class / className", `string`, `merged with cn(), so your Tailwind wins`],
    ["children / snippet", `content`, `label, content, whatever the piece holds`],
    ["...rest", `native props`, `pass straight through to the underlying element`],
  ];

  let q = $state("");
  let expanded = $state<string | null>(null);
  const needle = $derived(q.trim().toLowerCase());
  const rows = $derived(
    componentItems.filter(
      (it) =>
        !needle ||
        it.name.includes(needle) ||
        it.title.toLowerCase().includes(needle) ||
        it.description.toLowerCase().includes(needle)
    )
  );
</script>

<header class="wrap page-head">
  <h1>Docs.</h1>
  <p>
    Install pieces with the shadcn CLI (React) or shadcn-svelte (Svelte),
    customize with props, theme with tokens. The full registry reference is
    at the bottom.
  </p>
</header>

<main>
  <section class="section">
    <div class="wrap">
      <div class="show-layout">
        <aside class="show-side" aria-label="Documentation sections">
          <ul class="bk-list">
            {#each NAV as [id, label]}
              <li>
                <button
                  type="button"
                  class="bk-list__btn bk-cut"
                  onclick={() => scrollTo(id)}
                >
                  {label}
                </button>
              </li>
            {/each}
          </ul>
        </aside>
        <div class="show-main">
          <section class="section" id="installation" style="padding-top: 0;">
            <h2>Installation</h2>
            <h3>React requirements</h3>
            <ul>
              <li>
                React 18+ and Tailwind CSS v4 (the theme uses `@theme` /
                `@utility`).
              </li>
              <li>
                Component dependencies install themselves — e.g.
                <code>button</code> pulls in
                <code>class-variance-authority</code>, and everything pulls in
                <code>pixel-icon</code> automatically.
              </li>
            </ul>
            <h3>1 · Register the namespace (once per project)</h3>
            <InstallSnippet
              build={(run) =>
                `${run} shadcn@latest registry add @bricked=https://bricked-ui.vercel.app/r/{name}.json`}
            />
            <h3>2 · Add the registry, then a button</h3>
            <InstallSnippet
              build={(run) =>
                `${run} shadcn@latest registry add @bricked=https://bricked-ui.vercel.app/r/{name}.json\n${run} shadcn@latest add @bricked/button`}
            />
            <h3>Anatomy — what lands in your repo</h3>
            <div class="doc-code">
              components/ui/button.tsx
              <br />
              components/ui/pixel-icon.tsx
            </div>
            <p>
              That is it. The code is yours now — edit it freely, it will
              never be overwritten unless you run <code>add</code> again.
            </p>
            <h3>3 · Add the styles</h3>
            <InstallSnippet
              build={(run) =>
                `${run} shadcn@latest add @bricked/bricked-globals @bricked/bricked-css`}
            />
            <p>
              <code>bricked-globals</code> is the Tailwind v4 theme (tokens
              plus the <code>bk-cut</code> / <code>bk-bricks</code> utilities).
              <code>bricked-css</code> is the full <code>bk-*</code>
              stylesheet. Import both in your CSS entry.
            </p>
            <h3>Svelte — same bricks, runes inside</h3>
            <p>
              The Svelte 5 port lives at <code>ui/svelte</code> in the repo
              and ships as a shadcn-svelte registry (50 items) at
              <code>/r-svelte/</code> — the exact counterpart of
              <code>/r/</code> for React. Same <code>bk-*</code> classes and
              dark-mode behavior, Svelte runes for state —
              <code>bind:value</code>, <code>bind:checked</code>,
              <code>bind:open</code> — and snippets for children. Svelte
              components need no Tailwind and no npm dependencies: the only
              import they expect from your project is <code>cn</code> in
              <code>$lib/utils.ts</code>, which
              <code>shadcn-svelte init</code> creates.
            </p>
            <h3>1 · Init shadcn-svelte (once per project)</h3>
            <p>
              This creates <code>$lib/utils.ts</code> (the
              <code>cn</code> helper our components import) and your
              <code>components.json</code> aliases.
            </p>
            <InstallSnippet
              build={(run) => `${run} shadcn-svelte@latest init`}
            />
            <h3>2 · Add a component</h3>
            <InstallSnippet
              build={(run) =>
                `${run} shadcn-svelte@latest add https://bricked-ui.vercel.app/r-svelte/button.json`}
            />
            <p>
              That drops <code>button.svelte</code> (+
              <code>icon-button.svelte</code>) into
              <code>$lib/components/ui</code> and pulls
              <code>pixel-icon</code> automatically. Use it:
            </p>
            <CodeBlock
              text={`<script>\n  import Button from "$lib/components/ui/button.svelte";\n<\/script>\n\n<Button icon="rocket">Launch</Button>`}
            >
              &lt;script&gt;
              <br />
              &nbsp;&nbsp;import Button from
              &quot;$lib/components/ui/button.svelte&quot;;
              <br />
              &lt;/script&gt;
              <br />
              <br />
              &lt;Button icon=&quot;rocket&quot;&gt;Launch&lt;/Button&gt;
            </CodeBlock>
            <h3>3 · Add the styles</h3>
            <InstallSnippet
              build={(run) =>
                `${run} shadcn-svelte@latest add https://bricked-ui.vercel.app/r-svelte/bricked-css.json`}
            />
            <p>
              Then import it in <code>src/app.css</code> (it installs to
              <code>$lib/bricked.css</code>) and add the pixel fonts:
            </p>
            <CodeBlock
              text={`@import "$lib/bricked.css";\n\n/* layout head: Press Start 2P + VT323 from Google Fonts */`}
            >
              @import &quot;$lib/bricked.css&quot;;
            </CodeBlock>
            <p>
              Prefer npm? <code>ui/svelte</code> is also the
              <code>bricked-ui-svelte</code> package
              (<code>bun add bricked-ui-svelte</code>) with the same
              components. Registry sources stay in sync via
              <code>bun run gen-registry</code> +
              <code>bun run registry:build</code> in
              <code>ui/svelte</code>.
            </p>
          </section>

          <section class="section" id="usage">
            <h2>Usage</h2>
            <p>Drop the component in and set props. Variants first (React):</p>
            <CodeBlock
              text={`import { BrickedButton } from "@/components/ui/button";\n\n<BrickedButton size="md" icon="rocket">Launch</BrickedButton>\n<BrickedButton size="sm" variant="dark" icon="plus" iconPosition="right">Add</BrickedButton>`}
            >
              import {"{ BrickedButton }"} from "@/components/ui/button";
              <br />
              <br />
              &lt;BrickedButton size=&quot;md&quot;
              icon=&quot;rocket&quot;&gt;Launch&lt;/BrickedButton&gt;
              <br />
              &lt;BrickedButton size=&quot;sm&quot; variant=&quot;dark&quot;
              icon=&quot;plus&quot;
              iconPosition=&quot;right&quot;&gt;Add&lt;/BrickedButton&gt;
            </CodeBlock>
            <p>Icons work standalone too:</p>
            <CodeBlock
              text={`import { PixelIcon } from "@/components/ui/pixel-icon";\n\n<PixelIcon name="cart" />`}
            >
              import {"{ PixelIcon }"} from "@/components/ui/pixel-icon";
              <br />
              <br />
              &lt;PixelIcon name=&quot;cart&quot; /&gt;
            </CodeBlock>
            <p>
              Need something off-menu? Pass your own grid — one string per
              row, <code>&quot;1&quot;</code> = filled pixel, any size.
              It works on <code>PixelIcon</code> and on every
              <code>icon</code> prop:
            </p>
            <CodeBlock
              text={`import { PixelIcon } from "@/components/ui/pixel-icon";\n\nconst sparkle = ["0001000", "0111110", "1101011", "0111110", "0001000"];\n\n<PixelIcon grid={sparkle} />\n<BrickedButton icon={sparkle}>Custom</BrickedButton>`}
            >
              const sparkle = [&quot;0001000&quot;, &quot;0111110&quot;,
              &quot;1101011&quot;, &quot;0111110&quot;, &quot;0001000&quot;];
              <br />
              <br />
              &lt;PixelIcon grid={"{"}sparkle{"}"} /&gt;
              <br />
              &lt;BrickedButton icon={"{"}sparkle{"}"}&gt;Custom&lt;/BrickedButton&gt;
            </CodeBlock>
            <p>
              Same in Svelte: <code>&lt;PixelIcon grid={"{"}sparkle{"}"} /&gt;</code>
              and <code>&lt;Button icon={"{"}sparkle{"}"}&gt;</code>. Keep rows
              equal length; unknown names render nothing, never crash.
            </p>
            <p>
              Back, Next, Play and Save are not separate components — they are
              <code>button</code> with <code>icon=&quot;left&quot;</code>,
              <code>&quot;right&quot;</code>, <code>&quot;play&quot;</code> and
              <code>&quot;check&quot;</code>. One primitive, every action.
            </p>
          </section>

          <section class="section" id="theming">
            <h2>Theming</h2>
            <p>
              Flat colors only. Ink text on orange, never white on orange.
              Depth comes from hard inset bevels, never borders or blur.
              Corners are cut staircases, never rounded. Motion is
              <code>steps()</code> only — no smooth easing, no transitions.
            </p>
            <div class="doc-table-wrap">
              <table class="doc">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Hex</th>
                    <th>Use</th>
                  </tr>
                </thead>
                <tbody>
                  {#each TOKENS as [name, hex, use]}
                    <tr>
                      <td>{name}</td>
                      <td>{hex}</td>
                      <td>{use}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <h3>Retheme a token</h3>
            <p>Tokens are plain CSS variables — override them:</p>
            <CodeBlock
              text={`:root {\n  --color-brick: #7c3aed;\n  --color-shade: #5b21b6;\n}`}
            >
              :root {"{"}
              <br />
              &nbsp;&nbsp;--color-brick: #7c3aed;
              <br />
              &nbsp;&nbsp;--color-shade: #5b21b6;
              <br />
              {"}"}
            </CodeBlock>
            <p>
              Every bevel, brick fill and selected state follows, because they
              all read the tokens. (React users: same thing through
              <code>@theme</code> in Tailwind v4.)
            </p>
            <h3>Dark mode</h3>
            <p>
              The theme toggle sets <code>data-theme</code> on
              <code>&lt;html&gt;</code> (<code>light</code> /
              <code>dark</code>, or no attribute for <code>auto</code> which
              follows the OS). The page background and page text flip, and so
              do the light surfaces — <code>field</code>, <code>peach</code>
              and <code>peach-deep</code> deepen and their copy flips to
              <code>on-dark</code>. Orange faces keep ink text in both modes,
              and dark surfaces (<code>alert</code>, <code>toast</code>,
              <code>code</code>) are identical in both. All surfaces read
              variables, never hardcoded hex, so the toggle reaches every
              component.
            </p>
          </section>

          <section class="section" id="api">
            <h2>API reference</h2>
            <p>
              Every component speaks the same props. Learn these seven once
              and you know all {componentItems.length} items:
            </p>
            <div class="doc-table-wrap">
              <table class="doc">
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default + notes</th>
                  </tr>
                </thead>
                <tbody>
                  {#each PROPS as [name, type, note]}
                    <tr>
                      <td>{name}</td>
                      <td>{type}</td>
                      <td>{note}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </section>

          <section class="section" id="registry">
            <h2>Registry reference</h2>
            <p>
              All {componentItems.length} React components. First register
              <code>bunx shadcn registry add @bricked=https://bricked-ui.vercel.app/r/{"{name}"}.json</code>,
              then install with
              <code>bunx shadcn add @bricked/&lt;name&gt;</code> — or grab the
              Svelte twin from <code>/r-svelte/&lt;name&gt;.json</code>. Open
              <b>Code</b> to copy-paste files by hand. Type to filter, copy to
              grab the command.
            </p>
            <div
              class="bk-search"
              style="position: relative; max-width: 420px; margin-bottom: 12px;"
            >
              <input
                type="search"
                class="bk-input bk-cut"
                placeholder="Filter components…"
                aria-label="Filter components"
                style="padding-left: 52px;"
                bind:value={q}
              />
            </div>
            <p>{rows.length} of {componentItems.length} shown</p>
            <div class="doc-table-wrap">
              <table class="doc">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Add</th>
                    <th>Code</th>
                  </tr>
                </thead>
                <tbody>
                  {#each rows as it (it.name)}
                    <tr>
                      <td>@bricked/{it.name}</td>
                      <td>{it.title}</td>
                      <td>
                        {it.description}
                        <br />
                        <small>
                          {it.files
                            .map((f) => f.path.split("/").pop())
                            .join(", ")}
                        </small>
                      </td>
                      <td>
                        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                          <CopyButton
                            small
                            text={`bunx shadcn@latest add @bricked/${it.name}`}
                          />
                          <a
                            class="bricked-btn bricked-btn--sm"
                            style="text-decoration: none;"
                            href={`./r-svelte/${it.name}.json`}
                            title={`Svelte registry item: r-svelte/${it.name}.json`}
                          >
                            <span>.svelte</span>
                          </a>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          class="bricked-btn bricked-btn--sm"
                          aria-expanded={expanded === it.name}
                          onclick={() =>
                            (expanded = expanded === it.name ? null : it.name)}
                        >
                          <span>
                            {expanded === it.name ? "Hide" : "Code"}
                          </span>
                        </button>
                      </td>
                    </tr>
                    {#if expanded === it.name}
                      <tr>
                        <td colspan={5}>
                          <TunePanel name={it.name} title={it.title} />
                          <SourcePanel name={it.name} />
                        </td>
                      </tr>
                    {/if}
                  {/each}
                </tbody>
              </table>
            </div>
          </section>

          <section class="section" id="cli">
            <h2>CLI & namespaces</h2>
            <CodeBlock
              text="bunx shadcn@latest list @bricked\nbunx shadcn@latest search @bricked --query wall\nbunx shadcn@latest view @bricked/button\nbunx shadcn@latest add @bricked/wall-builder"
            >
              <b>bunx</b> shadcn@latest list @bricked
              <br />
              <b>bunx</b> shadcn@latest search @bricked --query wall
              <br />
              <b>bunx</b> shadcn@latest view @bricked/button
              <br />
              <b>bunx</b> shadcn@latest add @bricked/wall-builder
            </CodeBlock>
            <p>
              Without a namespace, use item URLs:
              <code>
                bunx shadcn add
                https://bricked-ui.vercel.app/r/button.json
              </code>
              . The React catalog lives at <code>/r/registry.json</code>; the
              Svelte catalog (50 items) is built from
              <code>ui/svelte/registry.json</code> and served at
              <code>/r-svelte/&lt;name&gt;.json</code> — install with
              <code>
                bun x shadcn-svelte@latest add
                https://bricked-ui.vercel.app/r-svelte/button.json
              </code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  </section>
</main>
