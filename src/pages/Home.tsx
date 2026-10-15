import * as React from "react";
import { ICONS, PixelIcon } from "../components/PixelIcon";
import { componentItems } from "../data/registry";

function LikeButton() {
  const [on, setOn] = React.useState(false);
  const [n, setN] = React.useState(12);
  return (
    <button
      type="button"
      aria-pressed={on}
      className={on ? "bk-like is-on" : "bk-like"}
      onClick={() => {
        setOn(!on);
        setN(n + (on ? -1 : 1));
      }}
    >
      <PixelIcon name="heart" />
      {n}
    </button>
  );
}

export function Home() {
  return (
    <>
      <header className="hero wrap">
        <span className="hero__kicker">{componentItems.length} COMPONENTS · SHADCN REGISTRY</span>
        <h1>
          Build it like
          <br />
          <span className="hl">brickwork.</span>
        </h1>
        <p className="lead">
          A chunky pixel-art kit for React apps. Pick any of the {componentItems.length}{" "}
          pieces, paste it into your project, and ship something with character.
        </p>
        <div className="hero__cta">
          <a className="bricked-btn" href="#/showcase">
            <PixelIcon name="rocket" />
            <span>See showcase</span>
          </a>
          <a className="bricked-btn bricked-btn--sm" href="#/docs">
            <PixelIcon name="star" />
            <span>Read docs</span>
          </a>
        </div>
        <div className="install" id="install">
          <code>
            <b>bunx</b> shadcn@latest add https://bricked-ui.vercel.app/r/button.json
          </code>
          <code>
            <b>bunx</b> shadcn@latest add @bricked/button
          </code>
        </div>
        <div className="stats">
          <span className="bk-badge bk-cut">{componentItems.length} pieces</span>
          <span className="bk-badge bk-cut">{Object.keys(ICONS).length} icons</span>
          <span className="bk-badge bk-cut bk-badge--dark">copy-paste</span>
          <span className="bk-badge bk-cut">yours to keep</span>
        </div>
      </header>

      <main>
        <section className="section">
          <div className="wrap">
            <h2>Start in 60 seconds</h2>
            <p className="sub">Three commands and you&apos;re laying bricks.</p>
            <div className="steps">
              <section className="bk-card bk-cut">
                <header className="bk-card__head">1 · Add the namespace</header>
                <div className="bk-card__body">
                  <p style={{ margin: 0 }}>Point your project at the registry once.</p>
                  <div className="install" style={{ justifyContent: "flex-start" }}>
                    <code>
                      <b>bunx</b> shadcn registry add @bricked=https://bricked-ui.vercel.app/r/{"{name}"}
                      .json
                    </code>
                  </div>
                </div>
              </section>
              <section className="bk-card bk-cut">
                <header className="bk-card__head">2 · Add a component</header>
                <div className="bk-card__body">
                  <p style={{ margin: 0 }}>Copy the code straight into your repo.</p>
                  <div className="install" style={{ justifyContent: "flex-start" }}>
                    <code>
                      <b>bunx</b> shadcn add @bricked/button
                    </code>
                  </div>
                </div>
              </section>
              <section className="bk-card bk-cut">
                <header className="bk-card__head">3 · Lay it</header>
                <div className="bk-card__body">
                  <div className="bk-row">
                    <button className="bricked-btn bricked-btn--sm">
                      <PixelIcon name="plus" />
                      <span>Lay brick</span>
                    </button>
                    <LikeButton />
                  </div>
                  <p style={{ margin: "8px 0 0" }}>
                    Full API in the <a href="#/docs">Docs</a>.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <h2>Taste of the wall</h2>
            <p className="sub">
              A few live pieces — the rest are waiting in the <a href="#/showcase">Showcase</a>.
            </p>
            <div className="bk-gallery">
              <section className="bk-card bk-cut">
                <header className="bk-card__head">Buttons</header>
                <div className="bk-card__body">
                  <div className="bk-row">
                    <button className="bricked-btn">
                      <PixelIcon name="rocket" />
                      <span>Launch</span>
                    </button>
                    <button className="bricked-btn bricked-btn--sm">
                      <PixelIcon name="plus" />
                      <span>Add</span>
                    </button>
                    <button className="bricked-btn" disabled>
                      <span>Saved</span>
                    </button>
                  </div>
                </div>
              </section>
              <section className="bk-card bk-cut">
                <header className="bk-card__head">Feedback</header>
                <div className="bk-card__body">
                  <div className="bk-alert bk-cut" role="alert">
                    <PixelIcon name="alert" />
                    <div>
                      <p className="bk-alert__title">Build failed</p>
                      <p>Step 3 stopped. Check the log.</p>
                    </div>
                  </div>
                  <div
                    className="bk-progress bk-cut"
                    role="progressbar"
                    aria-valuenow={60}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{ marginTop: 8 }}
                  >
                    <div className="bk-progress__fill" style={{ width: "60%" }} />
                  </div>
                </div>
              </section>
              <section className="bk-card bk-cut">
                <header className="bk-card__head">Tokens</header>
                <div className="bk-card__body">
                  <ul className="swatches">
                    <li className="sw" style={{ background: "#2b1100", color: "#ffd9b0" }}>ink</li>
                    <li className="sw" style={{ background: "#c25a00", color: "#fff" }}>shade</li>
                    <li className="sw" style={{ background: "#ff8a1f", color: "#2b1100" }}>orange</li>
                    <li className="sw" style={{ background: "#fff6ea", color: "#2b1100" }}>field</li>
                    <li className="sw" style={{ background: "#ffd3a1", color: "#2b1100" }}>peach</li>
                    <li className="sw" style={{ background: "#d63a1f", color: "#fff" }}>heart</li>
                  </ul>
                  <p style={{ margin: "8px 0 0" }}>
                    Every color has a job — see <a href="#/docs">Theming</a>.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
