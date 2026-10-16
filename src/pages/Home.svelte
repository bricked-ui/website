<script lang="ts">
  import PixelIcon from "../components/pixel-icon.svelte";
  import { ICONS } from "../components/icons.js";
  import { componentItems } from "../data/registry";
  import svelteCatalog from "../data/svelte.json";

  let on = $state(false);
  let n = $state(12);

  const svelteCount: number = (svelteCatalog as { count: number }).count;
</script>

<header class="hero wrap">
  <span class="hero__kicker">
    {componentItems.length} COMPONENTS · REACT + SVELTE
  </span>
  <h1>
    Build it like
    <br />
    <span class="hl">brickwork.</span>
  </h1>
  <p class="lead">
    A chunky pixel-art kit for React and Svelte apps. Pick any of the
    {componentItems.length} pieces — or the {svelteCount}-piece Svelte registry
    — paste it into your project, and ship something with character.
  </p>
  <div class="hero__cta">
    <a class="bricked-btn" href="#/showcase">
      <PixelIcon name="rocket" />
      <span>See showcase</span>
    </a>
    <a class="bricked-btn bricked-btn--sm" href="#/docs">
      <PixelIcon name="star" />
      <span>Read docs</span>
    </a>
  </div>
  <div class="install" id="install">
    <code>
      <b>bunx</b> shadcn@latest add https://bricked-ui.vercel.app/r/button.json
    </code>
    <code>
      <b>bun x</b> shadcn-svelte@latest add https://bricked-ui.vercel.app/r-svelte/button.json
    </code>
  </div>
  <div class="stats">
    <span class="bk-badge bk-cut">{componentItems.length} pieces</span>
    <span class="bk-badge bk-cut">{Object.keys(ICONS).length} icons</span>
    <span class="bk-badge bk-cut bk-badge--dark">copy-paste</span>
    <span class="bk-badge bk-cut">yours to keep</span>
  </div>
</header>

<main>
  <section class="section">
    <div class="wrap">
      <h2>Start in 60 seconds</h2>
      <p class="sub">Three commands and you&apos;re laying bricks.</p>
      <div class="steps">
        <section class="bk-card bk-cut">
          <header class="bk-card__head">1 · Add the registry</header>
          <div class="bk-card__body">
            <p style="margin: 0;">Point your project at a registry once.</p>
            <div class="install" style="justify-content: flex-start;">
              <code>
                <b>bunx</b> shadcn registry add @bricked=https://bricked-ui.vercel.app/r/{"{name}"}.json
              </code>
            </div>
          </div>
        </section>
        <section class="bk-card bk-cut">
          <header class="bk-card__head">2 · Add the registry, then a button</header>
          <div class="bk-card__body">
            <p style="margin: 0;">Register once, then copy the code straight into your repo.</p>
            <div class="install" style="justify-content: flex-start;">
              <code>
                <b>bunx</b> shadcn registry add @bricked=https://bricked-ui.vercel.app/r/{"{name}"}.json
              </code>
              <code>
                <b>bunx</b> shadcn add @bricked/button
              </code>
              <code>
                <b>bun x</b> shadcn-svelte add https://bricked-ui.vercel.app/r-svelte/button.json
              </code>
            </div>
          </div>
        </section>
        <section class="bk-card bk-cut">
          <header class="bk-card__head">3 · Lay it</header>
          <div class="bk-card__body">
            <div class="bk-row">
              <button class="bricked-btn bricked-btn--sm">
                <PixelIcon name="plus" />
                <span>Lay brick</span>
              </button>
              <button
                type="button"
                aria-pressed={on}
                class={on ? "bk-like is-on" : "bk-like"}
                onclick={() => {
                  on = !on;
                  n += on ? 1 : -1;
                }}
              >
                <PixelIcon name="heart" />
                {n}
              </button>
            </div>
            <p style="margin: 8px 0 0;">
              Full API in the <a href="#/docs">Docs</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Taste of the wall</h2>
      <p class="sub">
        A few live pieces — the rest are waiting in the
        <a href="#/showcase">Showcase</a>.
      </p>
      <div class="bk-gallery">
        <section class="bk-card bk-cut">
          <header class="bk-card__head">Buttons</header>
          <div class="bk-card__body">
            <div class="bk-row">
              <button class="bricked-btn">
                <PixelIcon name="rocket" />
                <span>Launch</span>
              </button>
              <button class="bricked-btn bricked-btn--sm">
                <PixelIcon name="plus" />
                <span>Add</span>
              </button>
              <button class="bricked-btn" disabled>
                <span>Saved</span>
              </button>
            </div>
          </div>
        </section>
        <section class="bk-card bk-cut">
          <header class="bk-card__head">Feedback</header>
          <div class="bk-card__body">
            <div class="bk-alert bk-cut" role="alert">
              <PixelIcon name="alert" />
              <div>
                <p class="bk-alert__title">Build failed</p>
                <p>Step 3 stopped. Check the log.</p>
              </div>
            </div>
            <div
              class="bk-progress bk-cut"
              role="progressbar"
              aria-valuenow={60}
              aria-valuemin={0}
              aria-valuemax={100}
              style="margin-top: 8px;"
            >
              <div class="bk-progress__fill" style="width: 60%;"></div>
            </div>
          </div>
        </section>
        <section class="bk-card bk-cut">
          <header class="bk-card__head">Tokens</header>
          <div class="bk-card__body">
            <ul class="swatches">
              <li class="sw" style="background: #2b1100; color: #ffd9b0;">ink</li>
              <li class="sw" style="background: #c25a00; color: #fff;">shade</li>
              <li class="sw" style="background: #ff8a1f; color: #2b1100;">orange</li>
              <li class="sw" style="background: #fff6ea; color: #2b1100;">field</li>
              <li class="sw" style="background: #ffd3a1; color: #2b1100;">peach</li>
              <li class="sw" style="background: #d63a1f; color: #fff;">heart</li>
            </ul>
            <p style="margin: 8px 0 0;">
              Every color has a job — see <a href="#/docs">Theming</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  </section>
</main>
