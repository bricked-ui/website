<script lang="ts">
  import { onMount } from "svelte";
  import Btn from "../components/Btn.svelte";
  import Card from "../components/Card.svelte";
  import Demo from "../components/Demo.svelte";
  import BrickDialog from "../components/BrickDialog.svelte";
  import PixelIcon from "../components/pixel-icon.svelte";
  import { ICONS, type PixelIconName } from "../components/icons.js";
  import { componentItems } from "../data/registry";
  import { CATEGORIES, type CategoryId } from "../data/showcase";

  interface Props {
    category: CategoryId;
  }

  let { category }: Props = $props();

  const meta = $derived(CATEGORIES.find((c) => c.id === category)!);

  /* ---- hoisted widget state (each demo below is used exactly once) ---- */
  let likeOn = $state(false);
  let likeN = $state(12);
  let switchOn = $state(true);
  let sliderV = $state(60);
  let counterV = $state(2);
  let ratingV = $state(4);
  let chipsItems = $state(["Pixel", "Orange", "Brick"]);
  let calDay = $state(15);
  let menuLabel = $state("Sort by");
  let modalOpen = $state(false);
  let dialogOpen = $state(false);
  let copyDone = $state(false);
  let diceFace = $state(5);
  let diceRolling = $state(false);
  let typeN = $state(0);
  let fly = $state(false);
  let fortuneA = $state("Ask me anything.");
  let wallN = $state(0);
  let countdownS = $state(3661);
  let clockT = $state(new Date());
  let tabsTab = $state("Info");
  let toggleOn = $state([true, false, false]);
  let ctxOpen = $state(false);
  let carouselS = $state(1);
  let quizPicked = $state(3);
  let quizAdvanced = $state(false);

  let diceTimer: ReturnType<typeof setInterval> | null = null;

  const TYPE_TEXT = "Hello, builder. Every wall starts with one brick.";
  const ANSWERS = [
    "Lay one more brick.",
    "Ask again after a snack.",
    "Yes, build it.",
    "The wall says no.",
    "Take a break first.",
    "Orange is always right.",
  ];
  const PIPS: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };
  const RING: Array<[number, number]> = [
    [1, 1], [1, 2], [1, 3], [2, 3], [3, 3], [3, 2], [3, 1], [2, 1],
  ];
  const ROWS = 4;
  const COLS = 6;
  const TOTAL = ROWS * COLS;

  const countdownH = $derived(Math.floor(countdownS / 3600));
  const countdownM = $derived(Math.floor((countdownS % 3600) / 60));
  const countdownSs = $derived(countdownS % 60);
  const pad = (n: number) => String(n).padStart(2, "0");

  onMount(() => {
    const clock = setInterval(() => (clockT = new Date()), 1000);
    const down = setInterval(
      () => (countdownS = Math.max(0, countdownS - 1)),
      1000
    );
    const typer = setInterval(() => {
      typeN = (typeN + 1) % (TYPE_TEXT.length + 20);
    }, 60);
    return () => {
      clearInterval(clock);
      clearInterval(down);
      clearInterval(typer);
      if (diceTimer) clearInterval(diceTimer);
    };
  });

  function rollDice() {
    diceRolling = true;
    let k = 0;
    diceTimer = setInterval(() => {
      diceFace = 1 + Math.floor(Math.random() * 6);
      if (++k >= 8) {
        if (diceTimer) clearInterval(diceTimer);
        diceRolling = false;
      }
    }, 90);
  }

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(
        "bunx shadcn registry add @bricked=https://bricked-ui.vercel.app/r/{name}.json\nbunx shadcn add @bricked/button"
      );
    } catch {
      /* clipboard unavailable — still flip the label */
    }
    copyDone = true;
    setTimeout(() => (copyDone = false), 1500);
  }

  $effect(() => {
    if (!ctxOpen) return;
    const close = () => (ctxOpen = false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  });
</script>

{#snippet section()}
{#if category === "actions"}
  <Card title="Actions — buttons">
    <Demo tag='@bricked/button presets — icon="left"/"right"'>
      <div class="bk-row">
        <Btn icon="plus" size="sm">Add</Btn>
        <Btn icon="rocket">Launch</Btn>
        <Btn icon="arrow">Next</Btn>
        <Btn disabled>Saved</Btn>
      </div>
    </Demo>
    <Demo tag="@bricked/button (icon-button variant)">
      <div class="bk-row">
        <button class="bk-ibtn bk-cut" aria-label="Favorites">
          <PixelIcon name="heart" />
          <span class="bk-ibtn__dot"></span>
        </button>
        <button class="bk-ibtn bk-cut" aria-label="Home">
          <PixelIcon name="home" />
        </button>
        <button class="bk-ibtn bk-cut" aria-label="Cart">
          <PixelIcon name="cart" />
          <span class="bk-ibtn__dot"></span>
        </button>
      </div>
    </Demo>
    <Demo tag="@bricked/like-button">
      <div class="bk-row">
        <button
          type="button"
          aria-pressed={likeOn}
          class={likeOn ? "bk-like is-on" : "bk-like"}
          onclick={() => {
            likeOn = !likeOn;
            likeN += likeOn ? 1 : -1;
          }}
        >
          <PixelIcon name="heart" />
          <span>{likeN}</span>
          {#if likeOn}
            <span class="bk-burst" aria-hidden="true">
              {#each [0, 1, 2, 3] as i}
                <span></span>
              {/each}
            </span>
          {/if}
        </button>
      </div>
    </Demo>
    <Demo tag='@bricked/button presets — icon="left"/"right"'>
      <div class="bk-row">
        <Btn icon="left" size="sm">Back</Btn>
        <Btn icon="right" size="sm">Next</Btn>
        <Btn icon="play" size="sm">Play</Btn>
        <Btn icon="check" size="sm">Save</Btn>
      </div>
    </Demo>
    <Demo tag="@bricked/button presets · @bricked/copy-button">
      <div class="bk-row">
        <Btn icon="cart" size="sm">Cart (2)</Btn>
        <Btn icon="rocket" size="sm">Launch</Btn>
        <Btn icon="down" size="sm">Load more</Btn>
        <Btn icon="close" size="sm">Delete</Btn>
        <button
          type="button"
          class="bricked-btn bricked-btn--sm"
          onclick={copyInstall}
        >
          <PixelIcon name={copyDone ? "check" : "plus"} />
          <span>{copyDone ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </Demo>
  </Card>
{:else if category === "icons"}
  <Card title="Pixel icons">
    <Demo tag="@bricked/pixel-icon — 22 glyphs (github is 16×16, the rest 7×7)">
      <div class="icon-grid">
        {#each Object.keys(ICONS) as name}
          <figure style={name === "github" ? "--icon: 2px;" : undefined}>
            <PixelIcon name={name as PixelIconName} />
            <figcaption>{name}</figcaption>
          </figure>
        {/each}
      </div>
    </Demo>
  </Card>
{:else if category === "containers"}
  <Card title="Containers">
    <Demo tag="@bricked/card">
      <p style="margin: 0;">
        Cards group related things under a brick-orange header.
      </p>
    </Demo>
    <Demo tag="@bricked/badge · avatar">
      <div class="bk-row">
        <span class="bk-badge bk-cut">Live</span>
        <span class="bk-badge bk-cut bk-badge--dark">Beta</span>
        <span class="bk-avatar bk-cut">NX</span>
        <span class="bk-avatar bk-cut bk-avatar--dark">AB</span>
      </div>
      <div class="bk-avatars" style="margin-top: 8px;">
        <span class="bk-avatar bk-cut">NX</span>
        <span class="bk-avatar bk-cut bk-avatar--dark">AB</span>
        <span class="bk-avatar bk-cut">Q</span>
      </div>
    </Demo>
    <Demo tag="@bricked/divider">
      <div class="bk-divider" role="separator">Snippet</div>
    </Demo>
    <Demo tag="@bricked/modal (dialog + sheet + confirm)">
      <button
        class="bricked-btn bricked-btn--sm"
        onclick={() => (modalOpen = true)}
      >
        <PixelIcon name="home" />
        <span>Open modal</span>
      </button>
      <BrickDialog
        title="Delete brick?"
        bind:open={modalOpen}
        onClose={() => (modalOpen = false)}
      >
        <p>This brick will be removed from your wall.</p>
        <div class="bk-row">
          <button
            class="bricked-btn bricked-btn--sm"
            onclick={() => (modalOpen = false)}
          >
            <span>Delete</span>
          </button>
          <button
            class="bricked-btn bricked-btn--sm"
            onclick={() => (modalOpen = false)}
          >
            <span>Cancel</span>
          </button>
        </div>
      </BrickDialog>
      <div class="drawer-demo" style="margin-top: 8px;">
        <p style="margin: 0 0 8px;"><b>Sheet: delete brick?</b></p>
        <p style="margin: 0 0 8px;">This brick will be removed.</p>
        <div class="bk-row">
          <Btn size="sm">Delete</Btn>
          <Btn size="sm">Cancel</Btn>
        </div>
      </div>
    </Demo>
    <Demo tag="@bricked/popover">
      <div class="pop-demo">Peach preview: 3 kg, fits two rooms.</div>
    </Demo>
  </Card>
{:else if category === "feedback"}
  <Card title="Feedback">
    <Demo tag="@bricked/alert">
      <div class="bk-alert bk-cut" role="alert">
        <PixelIcon name="alert" />
        <div>
          <p class="bk-alert__title">Build failed</p>
          <p>Step 3 stopped. Check the log.</p>
        </div>
      </div>
    </Demo>
    <Demo tag="@bricked/banner">
      <div class="bk-banner bk-cut" role="status">
        <PixelIcon name="star" />
        <span>New bricks just landed.</span>
      </div>
      <div class="bk-toast bk-cut" role="status" style="margin-top: 8px;">
        <PixelIcon name="alert" />
        <span>You are offline. Keep laying.</span>
      </div>
    </Demo>
    <Demo tag="@bricked/toast">
      <div class="bk-toast bk-cut" role="status">
        <PixelIcon name="check" />
        <span>Changes saved</span>
      </div>
      <div class="bk-toast bk-cut" role="status" style="margin-top: 8px;">
        <PixelIcon name="check" />
        <span>v2.4 ready — reload to update.</span>
      </div>
    </Demo>
    <Demo tag="@bricked/progress (bar + ring)">
      <div
        class="bk-progress bk-cut"
        role="progressbar"
        aria-valuenow={60}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div class="bk-progress__fill" style="width: 60%;"></div>
      </div>
      <div class="bk-row" style="margin-top: 8px;">
        <span class="bk-badge bk-cut">60%</span>
        <span class="bk-badge bk-cut bk-badge--dark">● live</span>
      </div>
    </Demo>
    <Demo tag="@bricked/skeleton · @bricked/ring-loader · stacking-loader">
      <div class="bk-row">
        <span class="bk-spin-wrap" role="status">
          <span class="bk-brick-spin" aria-hidden="true">
            {#each RING as [r, c], i}
              <span
                style="grid-row: {r}; grid-column: {c}; animation-delay: {i *
                  0.1}s;"
              ></span>
            {/each}
          </span>
          Loading
        </span>
      </div>
      <div class="bk-row" style="margin-top: 8px;">
        <span class="bk-spin-wrap" role="status">
          <span class="bk-stack-load" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          Stacking
        </span>
      </div>
      <div class="bk-skel-row" aria-hidden="true" style="margin-top: 8px;">
        <div class="bk-skel bk-skel--box bk-cut"></div>
        <div class="bk-skel-lines">
          <div class="bk-skel" style="width: 100%;"></div>
          <div class="bk-skel" style="width: 80%;"></div>
          <div class="bk-skel" style="width: 55%;"></div>
        </div>
      </div>
    </Demo>
  </Card>
{:else if category === "forms"}
  <Card title="Forms">
    <Demo tag="@bricked/field (label + hint) · @bricked/input">
      <div class="bk-field">
        <label class="bk-label" for="d-name">Name</label>
        <input id="d-name" class="bk-input bk-cut" placeholder="Your name" />
        <span>3–12 characters, please.</span>
      </div>
    </Demo>
    <Demo tag="@bricked/textarea">
      <textarea class="bk-input bk-cut" placeholder="Write something"></textarea>
    </Demo>
    <Demo tag="@bricked/select · @bricked/input (search + date variants)">
      <div class="bk-select">
        <select class="bk-input bk-cut" aria-label="Role">
          <option selected>Builder</option>
          <option>Designer</option>
          <option>Tester</option>
        </select>
        <PixelIcon name="down" />
      </div>
      <div class="bk-search" style="margin-top: 8px;">
        <input
          type="search"
          class="bk-input bk-cut"
          placeholder="Search bricks"
          aria-label="Search"
        />
        <PixelIcon name="search" />
      </div>
      <label class="bk-drop bk-cut" style="margin-top: 8px;">
        <input type="file" />
        <PixelIcon name="upload" />
        <span>Choose a file</span>
      </label>
    </Demo>
    <Demo tag="@bricked/checkbox · radio · @bricked/switch (incl. toggle)">
      <label class="bk-check">
        <input type="checkbox" checked />
        <span class="bk-check__box bk-cut">
          <PixelIcon name="check" />
        </span>
        Accept terms
      </label>
      <fieldset style="border: 0; margin: 0; padding: 0;">
        <legend class="bk-label">Plan</legend>
        <div class="bk-row" style="margin-top: 8px;">
          <label class="bk-check">
            <input type="radio" name="dplan" checked />
            <span class="bk-check__box bk-round">
              <PixelIcon name="dot" />
            </span>
            Free
          </label>
          <label class="bk-check">
            <input type="radio" name="dplan" />
            <span class="bk-check__box bk-round">
              <PixelIcon name="dot" />
            </span>
            Pro
          </label>
        </div>
      </fieldset>
      <div class="bk-row" style="margin-top: 8px;">
        <button
          type="button"
          role="switch"
          aria-checked={switchOn}
          aria-label="Sound"
          class="bk-switch bk-cut"
          onclick={() => (switchOn = !switchOn)}
        >
          <span class={switchOn ? "bk-switch__opt" : "bk-switch__opt is-on"}>
            Off
          </span>
          <span class={switchOn ? "bk-switch__opt is-on" : "bk-switch__opt"}>
            On
          </span>
        </button>
        <span>Sound</span>
      </div>
    </Demo>
    <Demo tag="@bricked/slider · counter · rating">
      <input
        type="range"
        class="bk-slider bk-cut"
        min={0}
        max={100}
        bind:value={sliderV}
        aria-label="Volume"
        style:--v={`${sliderV}%`}
      />
      <div class="bk-row" style="margin-top: 8px;">
        <div class="bk-count">
          <button
            type="button"
            aria-label="Less"
            class="bk-page bk-cut"
            disabled={counterV <= 0}
            onclick={() => (counterV -= 1)}
          >
            −
          </button>
          <output class="bk-count__val bk-cut">{counterV}</output>
          <button
            type="button"
            aria-label="More"
            class="bk-page bk-cut"
            disabled={counterV >= 9}
            onclick={() => (counterV += 1)}
          >
            +
          </button>
        </div>
        <div class="bk-rate" role="radiogroup" aria-label="Rating">
          {#each [1, 2, 3, 4, 5] as n}
            <button
              type="button"
              role="radio"
              aria-checked={ratingV === n}
              aria-label={`${n} stars`}
              class={n <= ratingV ? "is-on" : ""}
              onclick={() => (ratingV = n)}
            >
              <PixelIcon name="star" />
            </button>
          {/each}
        </div>
      </div>
    </Demo>
    <Demo tag="@bricked/chips · keycap · color-picker · otp-input">
      <ul class="bk-chips">
        {#each chipsItems as t (t)}
          <li class="bk-chip bk-cut">
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              class="bk-x"
              onclick={() => (chipsItems = chipsItems.filter((x) => x !== t))}
            >
              ×
            </button>
          </li>
        {/each}
      </ul>
      <div class="bk-keys" style="margin-top: 8px;">
        <kbd class="bk-key bk-cut">Ctrl</kbd>
        <span>+</span>
        <kbd class="bk-key bk-cut">K</kbd>
      </div>
      <div class="sw-row" style="margin-top: 8px;">
        {#each ["#ff8a1f", "#2b1100", "#fff6ea", "#ffd3a1", "#d63a1f"] as c}
          <button
            type="button"
            class="sw-dot"
            style="background: {c};"
            aria-label={c}
          ></button>
        {/each}
      </div>
      <div class="otp-row" style="margin-top: 8px;">
        {#each ["4", "0", "4", "2"] as d, i}
          <input
            class="bk-input bk-cut"
            maxlength={1}
            value={d}
            aria-label={`Digit ${i + 1}`}
          />
        {/each}
      </div>
    </Demo>
    <Demo tag="@bricked/list-group">
      <ul class="bk-list">
        <li>
          <button
            type="button"
            class="bk-list__btn bk-cut"
            aria-pressed="true"
          >
            Inbox
          </button>
        </li>
        <li>
          <button
            type="button"
            class="bk-list__btn bk-cut"
            aria-pressed="false"
          >
            Drafts
          </button>
        </li>
        <li>
          <button
            type="button"
            class="bk-list__btn bk-cut"
            aria-pressed="false"
          >
            Sent
          </button>
        </li>
      </ul>
    </Demo>
  </Card>
{:else if category === "navigation"}
  <Card title="Navigation">
    <Demo tag="@bricked/tabs">
      <div class="bk-tabs" role="tablist">
        {#each ["Info", "Specs", "Reviews"] as t}
          <button
            type="button"
            role="tab"
            aria-selected={tabsTab === t}
            class="bk-tab bk-cut"
            onclick={() => (tabsTab = t)}
          >
            {t}
          </button>
        {/each}
      </div>
      <div class="bk-panel bk-cut">
        {#if tabsTab === "Info"}
          A tough little build for everyday use.
        {:else if tabsTab === "Specs"}
          Weight: 3 kg. Fits in two rooms.
        {:else}
          Rated 4.8 by 120 builders.
        {/if}
      </div>
    </Demo>
    <Demo tag="@bricked/accordion">
      <div class="bk-acc">
        {#each ["Shipping", "Returns", "Support"] as t, i}
          <details name="showcase-accordion" open={i === 0}>
            <summary class="bk-acc__btn bk-cut">
              {t}
              <PixelIcon name="down" />
            </summary>
            <p class="bk-acc__body">
              {["Orders leave within two days.", "Send it back within 30 days.", "Chat is open every day."][i]}
            </p>
          </details>
        {/each}
      </div>
    </Demo>
    <Demo tag="@bricked/breadcrumbs">
      <nav aria-label="Breadcrumb">
        <ol class="bk-crumbs">
          <li class="bk-crumbs__item">
            <a
              href="#/showcase"
              onclick={(e) => e.preventDefault()}
            >
              Home
            </a>
          </li>
          <li class="bk-crumbs__item">
            <a
              href="#/showcase"
              onclick={(e) => e.preventDefault()}
            >
              Shop
            </a>
          </li>
          <li class="bk-crumbs__item">
            <span class="bk-crumb--current bk-cut" aria-current="page">
              Bricks
            </span>
          </li>
        </ol>
      </nav>
    </Demo>
    <Demo tag="@bricked/pagination">
      <nav class="bk-pages" aria-label="Pagination">
        <button class="bk-page bk-cut">1</button>
        <button class="bk-page bk-cut is-on">2</button>
        <button class="bk-page bk-cut">3</button>
      </nav>
      <div class="dots" style="margin-top: 8px;">
        <span></span>
        <span class="is-on"></span>
        <span></span>
        <span></span>
      </div>
    </Demo>
    <Demo tag="@bricked/stepper">
      <ol class="bk-steps">
        <li class="bk-step bk-step--done">
          <span class="bk-step__box bk-cut">✓</span>
          <span>Cart</span>
        </li>
        <li class="bk-step__line is-done" aria-hidden="true"></li>
        <li class="bk-step bk-step--now" aria-current="step">
          <span class="bk-step__box bk-cut">2</span>
          <span>Ship</span>
        </li>
        <li class="bk-step__line" aria-hidden="true"></li>
        <li class="bk-step bk-step--todo">
          <span class="bk-step__box bk-cut">3</span>
          <span>Pay</span>
        </li>
      </ol>
    </Demo>
    <Demo tag="@bricked/dropdown-menu · @bricked/command-palette">
      <div class="bk-menu-space">
        <div class="bk-menu">
          <button
            type="button"
            class="bricked-btn bricked-btn--sm"
            aria-haspopup="menu"
            popovertarget="sort-menu"
          >
            <span>{menuLabel}</span>
          </button>
          <div
            class="bk-menu__list bk-cut"
            role="menu"
            id="sort-menu"
            popover="auto"
          >
            {#each ["Newest", "Oldest", "Price"] as it}
              <button
                type="button"
                role="menuitem"
                class="bk-menu__item"
                popovertarget="sort-menu"
                popovertargetaction="hide"
                onclick={() => (menuLabel = it)}
              >
                {it}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </Demo>
    <Demo tag="@bricked/sidebar · sidebar-rail">
      <div class="bk-row" style="align-items: flex-start;">
        <aside
          class="bk-side bk-cut"
          style="min-height: 0; width: 200px;"
          aria-label="Demo sidebar"
        >
          <div class="bk-side__head">
            <PixelIcon name="home" />
            <span>Base</span>
          </div>
          <div class="bk-side__body">
            <button
              type="button"
              class="bk-list__btn bk-cut"
              aria-pressed="true"
            >
              Dashboard
            </button>
            <button
              type="button"
              class="bk-list__btn bk-cut"
              aria-pressed="false"
            >
              Bricks
            </button>
            <button
              type="button"
              class="bk-list__btn bk-cut"
              aria-pressed="false"
            >
              Settings
            </button>
          </div>
          <div class="bk-side__foot">
            <span class="bk-badge bk-cut">v2.4</span>
          </div>
        </aside>
        <nav class="bk-rail bk-cut" aria-label="Demo icon rail">
          <button type="button" class="bk-ibtn bk-cut" aria-label="Home">
            <PixelIcon name="home" />
          </button>
          <button type="button" class="bk-ibtn bk-cut" aria-label="Cart">
            <PixelIcon name="cart" />
          </button>
          <button
            type="button"
            class="bk-ibtn bk-cut"
            aria-label="Favorites"
          >
            <PixelIcon name="heart" />
          </button>
        </nav>
      </div>
    </Demo>
    <Demo tag="@bricked/scroll-area">
      <div class="scroll-demo">
        <p>Row one of many scrollable rows.</p>
        <p>Row two keeps the bevel honest.</p>
        <p>Row three still snaps to pixels.</p>
        <p>Row four never rounds a corner.</p>
      </div>
    </Demo>
    <Demo tag="@bricked/list-group · tooltip · @bricked/button">
      <span class="bk-tip">
        <Btn size="sm">Hint</Btn>
        <span class="bk-tip__bubble bk-cut" role="tooltip">
          Saves to the cloud
        </span>
      </span>
    </Demo>
  </Card>
{:else if category === "data"}
  <Card title="Data & time">
    <Demo tag="@bricked/data-table">
      <div class="bk-table-wrap bk-cut">
        <table class="bk-table">
          <thead>
            <tr>
              <th>Brick</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Red</td>
              <td>12</td>
              <td>$4</td>
            </tr>
            <tr>
              <td>Orange</td>
              <td>30</td>
              <td>$9</td>
            </tr>
            <tr>
              <td>Gray</td>
              <td>8</td>
              <td>$3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Demo>
    <Demo tag="@bricked/health-meter">
      <div class="bk-meter">
        <p class="bk-meter__label">HP 7/10</p>
        <div class="bk-meter__bar">
          {#each Array.from({ length: 10 }, (_, i) => i) as i}
            <span class={i < 7 ? "is-on" : ""}></span>
          {/each}
        </div>
      </div>
    </Demo>
    <Demo tag="@bricked/calendar · date-picker">
      <div class="bk-cal bk-cut">
        <p class="bk-cal__title">October 2026</p>
        <div class="bk-cal__grid">
          {#each ["M", "T", "W", "T", "F", "S", "S"] as d}
            <span class="bk-cal__dow">{d}</span>
          {/each}
          {#each [null, null, null, ...Array.from({ length: 31 }, (_, i) => i + 1)] as d}
            {#if d === null}
              <span></span>
            {:else}
              <button
                type="button"
                aria-pressed={d === calDay}
                class={d === calDay ? "bk-day is-on" : "bk-day"}
                onclick={() => (calDay = d)}
              >
                {d}
              </button>
            {/if}
          {/each}
        </div>
      </div>
    </Demo>
    <Demo tag="@bricked/timeline">
      <ol class="bk-tl">
        {#each [["Order placed", "Mon, 9:00"], ["Packed", "Tue, 14:30"], ["On the way", "Thu, 8:15"]] as [title, time]}
          <li>
            <span class="bk-tl__dot"></span>
            <div>
              <p class="bk-tl__title">{title}</p>
              <p>{time}</p>
            </div>
          </li>
        {/each}
      </ol>
    </Demo>
    <Demo tag="@bricked/clock · countdown · stat-card · leaderboard">
      <div class="bk-clock bk-cut" role="timer">
        <time datetime={clockT.toISOString()}>
          {clockT.toLocaleTimeString([], { hour12: false })}
        </time>
      </div>
      <div style="margin-top: 8px;">
        <div class="bk-clock bk-cut" role="timer">
          <time datetime={`PT${countdownH}H${countdownM}M${countdownSs}S`}>
            {pad(countdownH)}:{pad(countdownM)}:{pad(countdownSs)}
          </time>
        </div>
      </div>
      <div class="bk-stat bk-cut" style="margin-top: 8px;">
        <p>Bricks laid</p>
        <p class="bk-stat__value">1,284</p>
        <span class="bk-badge bk-cut">+12%</span>
      </div>
      <div style="margin-top: 8px;">
        <div class="lb-row">
          <span>1 · Ada</span>
          <span>9,410</span>
        </div>
        <div class="lb-row">
          <span>2 · Bo</span>
          <span>8,025</span>
        </div>
        <div class="lb-row">
          <span>3 · Cy</span>
          <span>7,300</span>
        </div>
      </div>
      <p style="margin: 8px 0 0;">
        $42.50 — VT323 price, coin not included.
      </p>
    </Demo>
    <Demo tag="@bricked/code-block · empty-state">
      <pre class="bk-code bk-cut"><code><span class="bk-code__k">const</span> brick = <span class="bk-code__s">"orange"</span>;{"\n"}<span class="bk-code__k">build</span>(brick);</code></pre>
      <div class="bk-empty bk-cut" style="margin-top: 8px;">
        <p class="bk-empty__title">Cart is empty</p>
        <p>Nothing here yet.</p>
        <Btn icon="plus" size="sm">Add item</Btn>
      </div>
    </Demo>
  </Card>
{:else if category === "fun"}
  <Card title="Fun — wall builder & friends">
    <Demo tag="@bricked/wall-builder">
      <div class="demo-wall">
        <div
          class="bk-wall"
          role="img"
          aria-label={`${wallN} of ${TOTAL} bricks laid`}
        >
          {#each Array.from({ length: ROWS }, (_, r) => r) as r}
            <div class={r % 2 ? "bk-wall__row is-odd" : "bk-wall__row"}>
              {#each Array.from({ length: COLS }, (_, c) => c) as c}
                <span class={r * COLS + c < wallN ? "is-on" : ""}></span>
              {/each}
            </div>
          {/each}
        </div>
      </div>
      <div class="bk-row" style="margin-top: 8px;">
        <button
          type="button"
          class="bricked-btn bricked-btn--sm"
          disabled={wallN >= TOTAL}
          onclick={() => (wallN = Math.min(TOTAL, wallN + 1))}
        >
          <PixelIcon name="plus" />
          <span>Lay brick</span>
        </button>
        <button
          type="button"
          class="bricked-btn bricked-btn--sm"
          onclick={() => (wallN = 0)}
        >
          <span>Reset</span>
        </button>
        <span>{wallN}/{TOTAL}</span>
      </div>
    </Demo>
    <Demo tag="@bricked/dice · coin-flip">
      <div class="bk-row">
        <div
          class="bk-die bk-cut"
          role="img"
          aria-label={`Die showing ${diceFace}`}
        >
          {#each Array.from({ length: 9 }, (_, i) => i) as i}
            <span class={PIPS[diceFace].includes(i) ? "is-on" : ""}></span>
          {/each}
        </div>
        <button
          type="button"
          class="bricked-btn bricked-btn--sm"
          disabled={diceRolling}
          onclick={rollDice}
        >
          <span>Roll</span>
        </button>
        <span>You got {diceFace}</span>
      </div>
    </Demo>
    <Demo tag="@bricked/typewriter">
      <p class="bk-type" aria-live="polite">
        {TYPE_TEXT.slice(0, Math.min(typeN, TYPE_TEXT.length))}
      </p>
    </Demo>
    <Demo tag="@bricked/launch-pad">
      <div class="bk-sky bk-cut" aria-hidden="true">
        <span class={fly ? "bk-rocket is-fly" : "bk-rocket"}>
          <PixelIcon name="rocket" />
        </span>
      </div>
      <div class="bk-row" style="margin-top: 8px;">
        <button
          type="button"
          class="bricked-btn bricked-btn--sm"
          disabled={fly}
          onclick={() => {
            fly = true;
            setTimeout(() => (fly = false), 1500);
          }}
        >
          <PixelIcon name="rocket" />
          <span>Launch</span>
        </button>
      </div>
    </Demo>
    <Demo tag="@bricked/fortune">
      <div class="bk-answer bk-cut" aria-live="polite">{fortuneA}</div>
      <div class="bk-row" style="margin-top: 8px;">
        <button
          type="button"
          class="bricked-btn bricked-btn--sm"
          onclick={() =>
            (fortuneA = ANSWERS[Math.floor(Math.random() * ANSWERS.length)])}
        >
          <PixelIcon name="star" />
          <span>Ask</span>
        </button>
      </div>
      <div class="bk-row" style="margin-top: 8px;">
        <span class="bk-badge bk-cut">First wall ★</span>
        <span class="bk-badge bk-cut bk-badge--dark">Score 1284</span>
      </div>
      <ul class="bk-list" style="margin-top: 8px;">
        <li>
          <button
            type="button"
            class="bk-list__btn bk-cut"
            aria-pressed="true"
          >
            Lay 10 bricks — done ✓
          </button>
        </li>
        <li>
          <button
            type="button"
            class="bk-list__btn bk-cut"
            aria-pressed="false"
          >
            Build a wall — 0/24
          </button>
        </li>
      </ul>
    </Demo>
  </Card>
{:else if category === "parity"}
  <Card title="Shadcn parity — chat, overlays & layout">
    <Demo tag="@bricked/dialog · alert-dialog · sheet · drawer · sidebar">
      <div class="bk-row">
        <button
          class="bricked-btn bricked-btn--sm"
          onclick={() => (dialogOpen = true)}
        >
          <span>Open dialog</span>
        </button>
      </div>
      <BrickDialog
        title="Build wall?"
        bind:open={dialogOpen}
        onClose={() => (dialogOpen = false)}
      >
        <p>24 bricks, zero radius.</p>
        <div class="bk-row">
          <button
            class="bricked-btn bricked-btn--sm"
            onclick={() => (dialogOpen = false)}
          >
            <span>Build</span>
          </button>
          <button
            class="bricked-btn bricked-btn--sm"
            onclick={() => (dialogOpen = false)}
          >
            <span>Cancel</span>
          </button>
        </div>
      </BrickDialog>
      <div class="drawer-demo" style="margin-top: 8px;">
        <p style="margin: 0 0 4px;"><b>Sheet</b></p>
        <p style="margin: 0;">Complements the main content.</p>
      </div>
      <div class="mini-side" style="margin-top: 8px;">
        <button
          type="button"
          class="bk-list__btn bk-cut"
          aria-pressed="true"
        >
          Dashboard
        </button>
        <button
          type="button"
          class="bk-list__btn bk-cut"
          aria-pressed="false"
        >
          Bricks
        </button>
        <button
          type="button"
          class="bk-list__btn bk-cut"
          aria-pressed="false"
        >
          Settings
        </button>
      </div>
    </Demo>
    <Demo tag="@bricked/message · bubble · message-scroller · marker · trace">
      <div
        class="scroll-demo"
        style="height: 150px;"
        role="region"
        aria-label="Demo chat log"
        tabindex={0}
      >
        <p style="margin: 0 0 8px;">
          <b>Ada:</b> Wall is up.
          <span class="bk-badge bk-cut">seen</span>
        </p>
        <p style="margin: 0 0 8px;">
          <b>You:</b> Lay one more brick.
        </p>
        <p style="margin: 0;">
          <b>Wall:</b> Orange is always right.
        </p>
      </div>
      <pre class="bk-code bk-cut" style="margin-top: 8px;">trace: thought “one more brick” → tool lay_brick(1) → ok</pre>
    </Demo>
    <Demo tag="@bricked/button-group · toggle-group · radio-group · menubar · navigation-menu · context-menu">
      <div class="bk-row">
        <Btn size="sm">Cut</Btn>
        <Btn size="sm">Copy</Btn>
        <Btn size="sm">Lay</Btn>
      </div>
      <div style="margin-top: 8px;">
        <div class="bk-row">
          {#each ["B", "I", "U"] as label, i}
            <button
              type="button"
              aria-pressed={toggleOn[i]}
              class={toggleOn[i] ? "bk-page bk-cut is-on" : "bk-page bk-cut"}
              onclick={() =>
                (toggleOn = toggleOn.map((v, j) => (j === i ? !v : v)))}
            >
              {label}
            </button>
          {/each}
        </div>
      </div>
      <div class="mini-nav" style="margin-top: 8px;">
        <span>File</span>
        <a
          href="#/showcase"
          onclick={(e) => e.preventDefault()}
        >
          Edit
        </a>
        <a
          href="#/showcase"
          onclick={(e) => e.preventDefault()}
        >
          View
        </a>
        <a
          href="#/showcase"
          onclick={(e) => e.preventDefault()}
        >
          Build
        </a>
      </div>
      <div
        class="bk-menu__list bk-cut"
        role="menu"
        hidden={!ctxOpen}
        style="position: static; margin-top: 8px;"
      >
        <button
          type="button"
          role="menuitem"
          class="bk-menu__item"
          onclick={() => (ctxOpen = false)}
        >
          Copy
        </button>
        <button
          type="button"
          role="menuitem"
          class="bk-menu__item"
          onclick={() => (ctxOpen = false)}
        >
          Delete
        </button>
      </div>
      <p style="margin: 8px 0 0;">
        Right-click
        <button
          type="button"
          class="bk-list__btn bk-cut"
          style="width: auto; display: inline-block;"
          oncontextmenu={(e) => {
            e.preventDefault();
            ctxOpen = true;
          }}
        >
          this brick
        </button>
        for the context menu.
      </p>
    </Demo>
    <Demo tag="@bricked/chart · carousel · collapsible · questionnaire">
      <div
        class="bk-row"
        style="align-items: flex-end;"
        aria-label="Weekly bricks laid"
      >
        {#each [24, 48, 36, 60] as h}
          <span
            style="width: 28px; height: {h}px; background: var(--orange); box-shadow: inset -3px -3px 0 var(--shade);"
          ></span>
        {/each}
        <span
          style="width: 28px; height: 44px; background: var(--field); box-shadow: inset 3px 3px 0 var(--shade);"
        ></span>
      </div>
      <div class="bk-row" style="margin-top: 8px;">
        <button
          type="button"
          class="bk-page bk-cut"
          aria-label="Previous"
          onclick={() => (carouselS = carouselS <= 1 ? 3 : carouselS - 1)}
        >
          ‹
        </button>
        <span class="bk-badge bk-cut">Slide {carouselS}/3</span>
        <button
          type="button"
          class="bk-page bk-cut"
          aria-label="Next"
          onclick={() => (carouselS = carouselS >= 3 ? 1 : carouselS + 1)}
        >
          ›
        </button>
      </div>
      <div class="bk-acc" style="margin-top: 8px;">
        <details>
          <summary class="bk-acc__btn bk-cut">More details</summary>
          <p class="bk-acc__body">mortar: #a24a00 at 30%.</p>
        </details>
      </div>
      <div class="bk-panel bk-cut" style="margin-top: 8px;">
        <p style="margin: 0 0 8px;">
          <b>{quizAdvanced ? "Q2." : "Q1."}</b>
          {quizAdvanced ? "Which shade? Bevel knows." : "How many bricks?"}
        </p>
        <div class="bk-row">
          {#each [1, 3, 9] as n}
            <button
              type="button"
              class={quizPicked === n ? "bk-page bk-cut is-on" : "bk-page bk-cut"}
              onclick={() => {
                quizPicked = n;
                quizAdvanced = true;
              }}
            >
              {n}
            </button>
          {/each}
        </div>
      </div>
    </Demo>
    <Demo tag="@bricked/item · attachment · input-group · separator · aspect-ratio · resizable · hover-card · typography · direction · spinner">
      <div class="bk-row">
        <div class="bk-chip bk-cut">
          wall.png · 12 KB
          <button type="button" aria-label="Remove file" class="bk-x">
            ×
          </button>
        </div>
      </div>
      <div class="bk-row" style="margin-top: 8px;">
        <input
          class="bk-input bk-cut"
          value="wall"
          aria-label="Name"
          style="flex: 1 1 200px; min-width: 0;"
        />
        <Btn size="sm">Save</Btn>
      </div>
      <div
        style="height: 4px; margin-top: 12px; background: repeating-linear-gradient(90deg, var(--shade) 0 4px, transparent 4px 8px);"
        role="separator"
      ></div>
      <div class="bk-row" style="margin-top: 8px;">
        <div
          class="bk-panel bk-cut"
          style="aspect-ratio: 16/9; display: grid; place-items: center; min-width: 160px;"
        >
          16 / 9
        </div>
        <div
          class="scroll-demo"
          style="height: 80px; min-width: 160px; resize: horizontal; overflow: auto;"
          role="region"
          aria-label="Resizable demo"
          tabindex={0}
        >
          Drag my corner — resizable.
        </div>
      </div>
      <div class="pop-demo" style="margin-top: 8px;">
        <b>Brick</b>
        <p style="margin: 4px 0 0;">A 16×8 pixel of pure orange.</p>
      </div>
      <div style="margin-top: 8px;" dir="rtl">
        <p style="margin: 0;">rtl: הבית בנוי מלבנים.</p>
      </div>
    </Demo>
  </Card>
{/if}
{/snippet}

<header class="wrap page-head">
  <span class="hero__kicker">SHOWCASE · {componentItems.length} PIECES</span>
  <h1>Every component, live.</h1>
  <p>
    Same CSS your app gets. React names match <code>@bricked/name</code>,
    Svelte names match <code>/r-svelte/name.json</code>. Install any piece
    with one command — see <a href="#/docs">Docs</a>.
  </p>
</header>

<main>
  <section class="section">
    <div class="wrap">
      <h2>{meta.label}</h2>
      <p class="sub">
        {meta.blurb} {meta.items.length} installable pieces on this shelf.
      </p>
      <div class="show-layout">
        <aside class="show-side" aria-label="Categories">
          <ul class="bk-list">
            {#each CATEGORIES as c}
              <li>
                <a
                  href={`#/showcase/${c.id}`}
                  aria-current={c.id === category ? "page" : undefined}
                  aria-pressed={c.id === category}
                  class="bk-list__btn bk-cut"
                  style="display: block; text-decoration: none;"
                >
                  {c.label} · {c.items.length}
                </a>
              </li>
            {/each}
          </ul>
        </aside>
        <div class="show-main">
          {@render section()}
        </div>
      </div>
    </div>
  </section>
</main>
