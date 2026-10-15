import * as React from "react";
import { ICONS, type PixelIconName } from "../components/PixelIcon";
import { EXPORTS } from "../data/exports";
import { componentItems } from "../data/registry";

type Pm = "bun" | "npm" | "pnpm" | "yarn";

const RUNNERS: Record<Pm, string> = {
  bun: "bunx",
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
};

const NAV: [string, string][] = [
  ["installation", "Installation"],
  ["usage", "Usage"],
  ["theming", "Theming"],
  ["api", "API reference"],
  ["registry", "Registry"],
  ["cli", "CLI"],
];

function scrollTo(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CopyButton({ text, small }: { text: string; small?: boolean }) {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      className={small ? "bricked-btn bricked-btn--sm" : "doc-copy"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* clipboard unavailable — still flip the label */
        }
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      <span>{done ? "Copied" : "Copy"}</span>
    </button>
  );
}

function CodeBlock({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="doc-code">
      <CopyButton text={text} />
      <div
        style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
        className="text-sm"
      >
        {children}
      </div>
    </div>
  );
}

type Size = "sm" | "md" | "lg";
type Variant = "primary" | "dark";

/** Per-component configurator: tweak the universal props and copy a
    ready-to-paste usage snippet. */
function TunePanel({ name, title }: { name: string; title: string }) {
  const exp = EXPORTS[name] ?? "Component";
  const [size, setSize] = React.useState<Size>("md");
  const [variant, setVariant] = React.useState<Variant>("primary");
  const [icon, setIcon] = React.useState<PixelIconName | "none">("rocket");
  const [iconPos, setIconPos] = React.useState<"left" | "right">("left");
  const [label, setLabel] = React.useState(title);
  const [cls, setCls] = React.useState("");
  const attrs =
    `size="${size}" variant="${variant}"` +
    (icon === "none" ? "" : ` icon="${icon}" iconPosition="${iconPos}"`) +
    (cls.trim() ? ` className="${cls.trim()}"` : "");
  const snippet = `<${exp} ${attrs}>${label}</${exp}>`;
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ margin: "0 0 8px" }}>
        <code>Tune</code> — every control below is a real prop on{" "}
        <code>{exp}</code>.
      </p>
      <div className="bk-row" style={{ marginBottom: 8 }}>
        {(["sm", "md", "lg"] as Size[]).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={size === s}
            className={size === s ? "bk-page bk-cut is-on" : "bk-page bk-cut"}
            onClick={() => setSize(s)}
          >
            {s}
          </button>
        ))}
        {(["primary", "dark"] as Variant[]).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={variant === v}
            className={
              variant === v ? "bk-page bk-cut is-on" : "bk-page bk-cut"
            }
            style={{ width: "auto", padding: "0 12px" }}
            onClick={() => setVariant(v)}
          >
            {v}
          </button>
        ))}
        {(["left", "right"] as const).map((p) => (
          <button
            key={p}
            type="button"
            aria-label={`Icon ${p}`}
            aria-pressed={iconPos === p}
            className={
              iconPos === p ? "bk-page bk-cut is-on" : "bk-page bk-cut"
            }
            style={{ width: "auto", padding: "0 12px" }}
            onClick={() => setIconPos(p)}
          >
            {p === "left" ? "←" : "→"}
          </button>
        ))}
      </div>
      <div className="bk-row" style={{ marginBottom: 8 }}>
        <select
          className="bk-input bk-cut"
          aria-label="Icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value as PixelIconName | "none")}
          style={{ width: "auto" }}
        >
          <option value="none">no icon</option>
          {Object.keys(ICONS).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <input
          className="bk-input bk-cut"
          aria-label="Label text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ flex: "1 1 160px", minWidth: 0 }}
        />
        <input
          className="bk-input bk-cut"
          aria-label="Extra classes"
          placeholder="extra-class"
          value={cls}
          onChange={(e) => setCls(e.target.value)}
          style={{ flex: "1 1 160px", minWidth: 0 }}
        />
      </div>
      <CodeBlock text={snippet}>
        &lt;{exp} {attrs}&gt;{label}&lt;/{exp}&gt;
      </CodeBlock>
    </div>
  );
}

interface SourceFile {
  path: string;
  content?: string;
}

/** Full source of one registry item, fetched from the served /r/*.json so
    users can copy-paste files by hand instead of using the CLI. */
function SourcePanel({ name }: { name: string }) {
  const [files, setFiles] = React.useState<SourceFile[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    let live = true;
    fetch(`${import.meta.env.BASE_URL}r/${name}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (live) setFiles(d.files ?? []);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [name]);
  if (failed)
    return <p>Could not load the source — use the CLI command instead.</p>;
  if (!files) return <p>Loading source…</p>;
  return (
    <div className="src-code" style={{ maxHeight: 480, overflow: "auto" }}>
      {files.map((f) => (
        <div key={f.path} style={{ marginBottom: 12 }}>
          <p style={{ margin: "0 0 4px" }}>
            <code className="text-sm">{f.path.split("/").pop()}</code>
          </p>
          <CodeBlock text={f.content ?? ""}>
            {f.content ?? ""}
          </CodeBlock>
        </div>
      ))}
      <p>
        Paste each file into the matching path in your repo, install any listed
        dependencies, done.
      </p>
    </div>
  );
}

/** Install snippet with bun / npm / pnpm / yarn tabs, shadcn-docs style. */
function InstallSnippet({ build }: { build: (run: string) => string }) {
  const [pm, setPm] = React.useState<Pm>("bun");
  const full = build(RUNNERS[pm]);
  const head = full.split(" ")[0];
  return (
    <>
      <div className="bk-tabs" role="tablist" aria-label="Package manager">
        {(Object.keys(RUNNERS) as Pm[]).map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={pm === p}
            className="bk-tab bk-cut"
            onClick={() => setPm(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="doc-code" style={{ marginTop: 8 }}>
        <CopyButton text={full} />
        <b>{head}</b>
        {full.slice(head.length)}
      </div>
    </>
  );
}

const TOKENS: [string, string, string][] = [
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

const PROPS: [string, string, string][] = [
  [
    "size",
    `"sm" | "md" | "lg"`,
    `"md" — sets --px, --cut, --icon and the font size`,
  ],
  [
    "variant",
    `"primary" | "dark"`,
    `"primary" — dark flips to ink surfaces with on-dark text`,
  ],
  [
    "icon",
    `PixelIconName`,
    `none — any of the 22 pixel glyphs, rendered left or right`,
  ],
  ["iconPosition", `"left" | "right"`, `"left"`],
  ["className", `string`, `merged with cn(), so your Tailwind wins`],
  ["children", `ReactNode`, `label, content, whatever the piece holds`],
  [
    "...rest",
    `native props`,
    `pass straight through to the underlying element`,
  ],
];

export function Docs() {
  const [q, setQ] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const needle = q.trim().toLowerCase();
  const rows = componentItems.filter(
    (it) =>
      !needle ||
      it.name.includes(needle) ||
      it.title.toLowerCase().includes(needle) ||
      it.description.toLowerCase().includes(needle),
  );
  return (
    <>
      <header className="wrap page-head">
        <h1>Docs.</h1>
        <p>
          Install pieces with the shadcn CLI, customize with props, theme with
          tokens. The full registry reference is at the bottom.
        </p>
      </header>

      <main>
        <section className="section">
          <div className="wrap">
            <div className="show-layout">
              <aside className="show-side" aria-label="Documentation sections">
                <ul className="bk-list">
                  {NAV.map(([id, label]) => (
                    <li key={id}>
                      <button
                        type="button"
                        className="bk-list__btn bk-cut"
                        onClick={() => scrollTo(id)}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>
              <div className="show-main">
                <section
                  className="section"
                  id="installation"
                  style={{ paddingTop: 0 }}
                >
                  <h2>Installation</h2>
                  <h3>Requirements</h3>
                  <ul>
                    <li>
                      React 18+ and Tailwind CSS v4 (the theme uses `@theme` /
                      `@utility`).
                    </li>
                    <li>
                      Component dependencies install themselves — e.g.{" "}
                      <code>button</code> pulls in{" "}
                      <code>class-variance-authority</code>, and everything
                      pulls in <code>pixel-icon</code> automatically.
                    </li>
                  </ul>
                  <h3>1 · Register the namespace (once per project)</h3>
                  <InstallSnippet
                    build={(run) =>
                      `${run} shadcn@latest registry add @bricked=https://bricked-ui.vercel.app/r/{name}.json`
                    }
                  />
                  <h3>2 · Add a component</h3>
                  <InstallSnippet
                    build={(run) => `${run} shadcn@latest add @bricked/button`}
                  />
                  <h3>Anatomy — what lands in your repo</h3>
                  <div className="doc-code">
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
                      `${run} shadcn@latest add @bricked/bricked-globals @bricked/bricked-css`
                    }
                  />
                  <p>
                    <code>bricked-globals</code> is the Tailwind v4 theme
                    (tokens plus the <code>bk-cut</code> /{" "}
                    <code>bk-bricks</code> utilities). <code>bricked-css</code>{" "}
                    is the full <code>bk-*</code> stylesheet. Import both in
                    your CSS entry.
                  </p>
                </section>

                <section className="section" id="usage">
                  <h2>Usage</h2>
                  <p>Drop the component in and set props. Variants first:</p>
                  <CodeBlock
                    text={`import { BrickedButton } from "@/components/ui/button";\n\n<BrickedButton size="md" icon="rocket">Launch</BrickedButton>\n<BrickedButton size="sm" variant="dark" icon="plus" iconPosition="right">Add</BrickedButton>`}
                  >
                    import {"{ BrickedButton }"} from "@/components/ui/button";
                    <br />
                    <br />
                    &lt;BrickedButton size=&quot;md&quot;
                    icon=&quot;rocket&quot;&gt;Launch&lt;/BrickedButton&gt;
                    <br />
                    &lt;BrickedButton size=&quot;sm&quot;
                    variant=&quot;dark&quot; icon=&quot;plus&quot;
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
                    Back, Next, Play and Save are not separate components — they
                    are <code>button</code> with{" "}
                    <code>icon=&quot;left&quot;</code>,{" "}
                    <code>&quot;right&quot;</code>,{" "}
                    <code>&quot;play&quot;</code> and{" "}
                    <code>&quot;check&quot;</code>. One primitive, every action.
                  </p>
                </section>

                <section className="section" id="theming">
                  <h2>Theming</h2>
                  <p>
                    Flat colors only. Ink text on orange, never white on orange.
                    Depth comes from hard inset bevels, never borders or blur.
                    Corners are cut staircases, never rounded. Motion is{" "}
                    <code>steps()</code> only — no smooth easing, no
                    transitions.
                  </p>
                  <div className="doc-table-wrap">
                    <table className="doc">
                      <thead>
                        <tr>
                          <th>Token</th>
                          <th>Hex</th>
                          <th>Use</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TOKENS.map(([name, hex, use]) => (
                          <tr key={name}>
                            <td>{name}</td>
                            <td>{hex}</td>
                            <td>{use}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <h3>Retheme a token</h3>
                  <p>
                    Tokens are plain Tailwind v4 theme variables — override
                    them:
                  </p>
                  <CodeBlock
                    text={`@theme {\n  --color-brick: #7c3aed;\n  --color-shade: #5b21b6;\n}`}
                  >
                    @theme {"{"}
                    <br />
                    &nbsp;&nbsp;--color-brick: #7c3aed;
                    <br />
                    &nbsp;&nbsp;--color-shade: #5b21b6;
                    <br />
                    {"}"}
                  </CodeBlock>
                  <p>
                    Every bevel, brick fill and selected state follows, because
                    they all read the tokens.
                  </p>
                </section>

                <section className="section" id="api">
                  <h2>API reference</h2>
                  <p>
                    Every component speaks the same props. Learn these seven
                    once and you know all {componentItems.length} items:
                  </p>
                  <div className="doc-table-wrap">
                    <table className="doc">
                      <thead>
                        <tr>
                          <th>Prop</th>
                          <th>Type</th>
                          <th>Default + notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PROPS.map(([name, type, note]) => (
                          <tr key={name}>
                            <td>{name}</td>
                            <td>{type}</td>
                            <td>{note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="section" id="registry">
                  <h2>Registry reference</h2>
                  <p>
                    All {componentItems.length} components. Install with{" "}
                    <code>bunx shadcn add @bricked/&lt;name&gt;</code>, open{" "}
                    <b>Code</b> to copy-paste files by hand. Type to filter,
                    copy to grab the command.
                  </p>
                  <div
                    className="bk-search"
                    style={{
                      position: "relative",
                      maxWidth: 420,
                      marginBottom: 12,
                    }}
                  >
                    <input
                      type="search"
                      className="bk-input bk-cut"
                      placeholder="Filter components…"
                      aria-label="Filter components"
                      style={{ paddingLeft: 52 }}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                    />
                  </div>
                  <p>
                    {rows.length} of {componentItems.length} shown
                  </p>
                  <div className="doc-table-wrap">
                    <table className="doc">
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
                        {rows.map((it) => (
                          <React.Fragment key={it.name}>
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
                                <CopyButton
                                  small
                                  text={`bunx shadcn@latest add @bricked/${it.name}`}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="bricked-btn bricked-btn--sm"
                                  aria-expanded={expanded === it.name}
                                  onClick={() =>
                                    setExpanded(
                                      expanded === it.name ? null : it.name,
                                    )
                                  }
                                >
                                  <span>
                                    {expanded === it.name ? "Hide" : "Code"}
                                  </span>
                                </button>
                              </td>
                            </tr>
                            {expanded === it.name && (
                              <tr>
                                <td colSpan={5}>
                                  <TunePanel name={it.name} title={it.title} />
                                  <SourcePanel name={it.name} />
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="section" id="cli">
                  <h2>CLI & namespaces</h2>
                  <CodeBlock text="bunx shadcn@latest list @bricked\nbunx shadcn@latest search @bricked --query wall\nbunx shadcn@latest view @bricked/button\nbunx shadcn@latest add @bricked/wall-builder">
                    <b>bunx</b> shadcn@latest list @bricked
                    <br />
                    <b>bunx</b> shadcn@latest search @bricked --query wall
                    <br />
                    <b>bunx</b> shadcn@latest view @bricked/button
                    <br />
                    <b>bunx</b> shadcn@latest add @bricked/wall-builder
                  </CodeBlock>
                  <p>
                    Without a namespace, use item URLs:{" "}
                    <code>
                      bunx shadcn add
                      https://bricked-ui.vercel.app/r/button.json
                    </code>
                    . The catalog lives at <code>/r/registry.json</code>.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
