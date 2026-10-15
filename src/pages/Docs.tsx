import * as React from "react";
import { componentItems } from "../data/registry";

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

export function Docs() {
  const [q, setQ] = React.useState("");
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

      <main className="wrap">
        <section className="section" id="quickstart">
          <h2>Quickstart</h2>
          <h3>1 · Register the namespace (once per project)</h3>
          <div className="doc-code">
            <b>bunx</b> shadcn@latest registry add
            @bricked=https://bricked-ui.dev/r/{"{name}"}
            .json
          </div>
          <h3>2 · Add a component</h3>
          <div className="doc-code">
            <b>bunx</b> shadcn@latest add @bricked/button
          </div>
          <p>
            This copies <code>button.tsx</code> and <code>pixel-icon.tsx</code>{" "}
            into your <code>components/ui</code> and installs{" "}
            <code>class-variance-authority</code>. You own the code after that.
          </p>
          <h3>3 · Add the styles</h3>
          <div className="doc-code">
            <b>bunx</b> shadcn@latest add @bricked/bricked-globals
            @bricked/bricked-css
          </div>
          <p>
            <code>bricked-globals</code> is the Tailwind v4 theme (tokens +{" "}
            <code>bk-cut</code> / <code>bk-bricks</code> utilities).{" "}
            <code>bricked-css</code> is the full <code>bk-*</code> stylesheet.
            Import both in your CSS entry.
          </p>
        </section>

        <section className="section" id="usage">
          <h2>Usage</h2>
          <div className="doc-code">
            import {"{ BrickedButton }"} from "@/components/ui/button";
            <br />
            <br />
            &lt;BrickedButton size=&quot;md&quot;
            icon=&quot;rocket&quot;&gt;Launch&lt;/BrickedButton&gt;
            <br />
            &lt;BrickedButton size=&quot;sm&quot; variant=&quot;dark&quot;
            icon=&quot;plus&quot;
            iconPosition=&quot;right&quot;&gt;Add&lt;/BrickedButton&gt;
          </div>
          <p>
            Back, Next, Play and Save are not separate components — they are{" "}
            <code>button</code> with <code>icon=&quot;left&quot;</code>,{" "}
            <code>&quot;right&quot;</code>, <code>&quot;play&quot;</code> and{" "}
            <code>&quot;check&quot;</code>. One primitive, every action.
          </p>
        </section>

        <section className="section" id="customization">
          <h2>Customization</h2>
          <p>
            Every component takes <code>size</code> (<code>sm</code>/
            <code>md</code>/<code>lg</code> → <code>--px</code>/
            <code>--cut</code>/<code>--icon</code>), <code>variant</code> (
            <code>primary</code>/<code>dark</code>), <code>icon</code> (any of
            the 20 pixel glyphs), <code>iconPosition</code> and{" "}
            <code>className</code> (merged with <code>cn()</code>, so Tailwind
            wins). All other props pass straight through to the underlying
            element.
          </p>
          <h3>Sizes</h3>
          <div className="doc-table-wrap">
            <table className="doc">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>--px</th>
                  <th>--cut</th>
                  <th>--icon</th>
                  <th>Font</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>sm</td>
                  <td>4px</td>
                  <td>1.5px</td>
                  <td>3px</td>
                  <td>11px</td>
                </tr>
                <tr>
                  <td>md</td>
                  <td>6px</td>
                  <td>2px</td>
                  <td>4px</td>
                  <td>14px</td>
                </tr>
                <tr>
                  <td>lg</td>
                  <td>8px</td>
                  <td>3px</td>
                  <td>5px</td>
                  <td>18px</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" id="theming">
          <h2>Theming</h2>
          <p>
            Flat colors only. Ink text on orange, never white on orange. Depth
            comes from hard inset bevels, never borders or blur. Corners are cut
            staircases, never rounded. Motion is <code>steps()</code> only — no
            smooth easing, no transitions.
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
        </section>

        <section className="section" id="registry">
          <h2>Registry reference</h2>
          <p>
            All {componentItems.length} components. Install with{" "}
            <code>bunx shadcn add @bricked/&lt;name&gt;</code>. Type to filter.
          </p>
          <div
            className="bk-search"
            style={{ position: "relative", maxWidth: 420, marginBottom: 12 }}
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
                </tr>
              </thead>
              <tbody>
                {rows.map((it) => (
                  <tr key={it.name}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" id="cli">
          <h2>CLI & namespaces</h2>
          <div className="doc-code">
            <b>bunx</b> shadcn@latest list @bricked
            <br />
            <b>bunx</b> shadcn@latest search @bricked --query wall
            <br />
            <b>bunx</b> shadcn@latest view @bricked/button
            <br />
            <b>bunx</b> shadcn@latest add @bricked/wall-builder
          </div>
          <p>
            Without a namespace, use item URLs:{" "}
            <code>bunx shadcn add https://bricked-ui.dev/r/button.json</code>.
            The catalog lives at <code>/r/registry.json</code>.
          </p>
        </section>
      </main>
    </>
  );
}
