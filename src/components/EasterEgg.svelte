<script lang="ts">
  import { onMount } from "svelte";

  // Missing-brick strip + REAL component-by-component brick construction.
  // Every layout block gets a brick cover grid; each brick lays bottom-up and
  // its own spot reveals instantly — hole flashes matte (fresh/raw), glosses
  // polished, then turns transparent onto the real component underneath.
  const FOUNDATION_BRICKS = 28;
  const MISSING = 19;

  const ITEM_PAUSE = 120;

  let rebuilding = $state(false);
  let placed = $state(0);
  let totalCells = $state(0);
  let done = $state(false);
  let blockIdx = $state(0);
  let blockTotal = $state(0);
  let blockLabel = $state("");

  let runSeq = 0;
  let cancelled = false;
  let skipRequested = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let wake: (() => void) | null = null;

  interface Cell {
    el: HTMLSpanElement;
  }
  interface Block {
    item: HTMLElement;
    overlay: HTMLDivElement;
    rows: Cell[][];
    madeRelative: boolean;
    label: string;
  }

  let blocks: Block[] = [];

  const pct = $derived(totalCells ? Math.round((placed / totalCells) * 100) : 0);
  const tick = $derived(totalCells > 350 ? 24 : 32);

  const SELECTORS = [
    ".site-body .nav",
    ".site-body .hero__kicker",
    ".site-body .hero h1",
    ".site-body .hero p.lead",
    ".site-body .hero__cta",
    ".site-body .hero .install code",
    ".site-body .hero .stats",
    ".site-body .page-head > *",
    ".site-body .show-side",
    ".site-body .steps > *",
    ".site-body .bk-gallery > *",
    ".site-body .show-main .bk-card",
    ".site-body main .doc-code",
    ".site-body main table.doc",
    ".site-body .site-footer p",
  ];

  function labelFor(el: HTMLElement): string {
    const cls = (el.getAttribute("class") || "").split(/\s+/).find(
      (c) => c && !c.startsWith("bk-") && c !== "wrap" && !c.startsWith("egg-")
    );
    return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
  }

  function collect(): HTMLElement[] {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTORS.join(","))
    );
    const set = new Set<HTMLElement>(nodes);
    // Visible only, then drop anything nested inside another match
    // (keep the outermost block so covers never nest).
    const vis = nodes.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 24 && r.height > 14;
    });
    const top = vis.filter((el) => {
      let p = el.parentElement;
      while (p) {
        if (set.has(p as HTMLElement)) return false;
        p = p.parentElement;
      }
      return true;
    });
    const seen = new Set<HTMLElement>();
    const out: HTMLElement[] = [];
    for (const el of top) {
      if (seen.has(el)) continue;
      seen.add(el);
      out.push(el);
    }
    return out.slice(0, 40);
  }

  function buildBlocks(items: HTMLElement[]): number {
    blocks = [];
    let n = 0;
    for (const item of items) {
      const w = item.offsetWidth;
      const h = item.offsetHeight;
      if (w < 24 || h < 14) continue;
      let cols = Math.max(2, Math.min(6, Math.round(w / 64)));
      let rows = Math.max(1, Math.min(4, Math.round(h / 40)));
      while (cols * rows > 16) {
        if (cols >= rows && cols > 2) cols--;
        else if (rows > 1) rows--;
        else break;
      }
      const overlay = document.createElement("div");
      overlay.className = "egg-cover";
      overlay.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      overlay.setAttribute("aria-hidden", "true");
      const cells: HTMLSpanElement[] = [];
      for (let i = 0; i < cols * rows; i++) {
        const s = document.createElement("span");
        s.className = "egg-cell";
        overlay.appendChild(s);
        cells.push(s);
      }
      const madeRelative =
        getComputedStyle(item).position === "static";
      if (madeRelative) item.style.position = "relative";
      item.appendChild(overlay);
      // Placement order: bottom row first, left to right (like laying bricks).
      const grid: Cell[][] = [];
      for (let r = rows - 1; r >= 0; r--) {
        const row: Cell[] = [];
        for (let c = 0; c < cols; c++) row.push({ el: cells[r * cols + c] });
        grid.push(row);
      }
      blocks.push({
        item,
        overlay,
        rows: grid,
        madeRelative,
        label: labelFor(item),
      });
      n += cols * rows;
    }
    return n;
  }

  function nap(ms: number): Promise<void> {
    return new Promise<void>((res) => {
      wake = () => {
        wake = null;
        timer = null;
        res();
      };
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        wake = null;
        timer = null;
        res();
      }, ms);
    });
  }

  function abortSleep() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (wake) {
      const w = wake;
      wake = null;
      w();
    }
  }

  function removeOverlay(b: Block) {
    if (b.overlay.isConnected) b.overlay.remove();
    if (b.madeRelative) b.item.style.removeProperty("position");
  }

  function flashItem(b: Block, id: number) {
    b.item.classList.add("egg-item-done");
    setTimeout(() => {
      if (id === runSeq) b.item.classList.remove("egg-item-done");
      else b.item.classList.remove("egg-item-done");
    }, 700);
  }

  function resetState() {
    rebuilding = false;
    placed = 0;
    totalCells = 0;
    done = false;
    blockIdx = 0;
    blockTotal = 0;
    blockLabel = "";
    blocks = [];
    cancelled = false;
    skipRequested = false;
    document.body.classList.remove("egg-rebuilding");
  }

  function teardown() {
    for (const b of blocks) {
      if (b.overlay.isConnected) b.overlay.remove();
      if (b.madeRelative) b.item.style.removeProperty("position");
      b.item.classList.remove("egg-item-done");
    }
  }

  async function finishInstant(id: number) {
    for (const b of blocks) {
      for (const row of b.rows)
        for (const cell of row) cell.el.classList.add("is-open");
    }
    placed = totalCells;
    blockIdx = blockTotal;
    for (const b of blocks) {
      removeOverlay(b);
      b.item.classList.add("egg-item-done");
    }
    done = true;
    await nap(900);
    if (id !== runSeq || cancelled) return;
    teardown();
    resetState();
  }

  async function drive(id: number) {
    let fresh: Cell | null = null;
    for (let bi = 0; bi < blocks.length; bi++) {
      if (id !== runSeq || cancelled) return;
      if (skipRequested) {
        await finishInstant(id);
        return;
      }
      const b = blocks[bi];
      blockIdx = bi + 1;
      blockLabel = b.label;
      b.item.scrollIntoView({ block: "center" });
      await nap(140);
      if (id !== runSeq || cancelled) return;
      if (skipRequested) {
        await finishInstant(id);
        return;
      }
      for (let r = 0; r < b.rows.length; r++) {
        const row = b.rows[r];
        for (const cell of row) {
          if (id !== runSeq || cancelled) return;
          if (skipRequested) {
            await finishInstant(id);
            return;
          }
          // The brick lands and its own spot reveals at once: the flash
          // plays inside `is-open`, newest stays `is-fresh` (raw) until the
          // next brick lands, then it counts as polished.
          if (fresh && fresh.el !== cell.el)
            fresh.el.classList.remove("is-fresh");
          cell.el.classList.add("is-open", "is-fresh");
          fresh = cell;
          placed += 1;
          await nap(tick);
        }
        if (id !== runSeq || cancelled) return;
      }
      if (id !== runSeq || cancelled) return;
      if (skipRequested) {
        await finishInstant(id);
        return;
      }
      await nap(ITEM_PAUSE);
      if (id !== runSeq || cancelled) return;
      if (fresh) {
        fresh.el.classList.remove("is-fresh");
        fresh = null;
      }
      removeOverlay(b);
      flashItem(b, id);
    }
    if (id !== runSeq || cancelled) return;
    done = true;
    await nap(1500);
    if (id !== runSeq || cancelled) return;
    resetState();
  }

  function start() {
    if (rebuilding) return;
    const items = collect();
    if (!items.length) return;
    runSeq++;
    cancelled = false;
    skipRequested = false;
    document.body.classList.add("egg-rebuilding");
    window.scrollTo(0, 0);
    const n = buildBlocks(items);
    if (!n || !blocks.length) {
      teardown();
      resetState();
      return;
    }
    totalCells = n;
    blockTotal = blocks.length;
    rebuilding = true;
    placed = 0;
    done = false;
    blockIdx = 0;
    void drive(runSeq);
  }

  function close() {
    if (!rebuilding) return;
    cancelled = true;
    runSeq++;
    abortSleep();
    teardown();
    resetState();
  }

  function skip() {
    if (!rebuilding || done) return;
    skipRequested = true;
    abortSleep();
  }

  onMount(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && rebuilding) close();
    };
    const onNav = () => {
      if (rebuilding) close();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onNav);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onNav);
    };
  });
</script>

<!-- The missing brick: a foundation strip pinned to the bottom of the site. -->
<div class="egg-strip" aria-label="Foundation with one brick missing">
  {#each Array.from({ length: FOUNDATION_BRICKS }, (_, i) => i) as i}
    {#if i === MISSING}
      <button
        type="button"
        class="egg-gap"
        aria-label="A brick is missing. Lay it to rebuild the site?"
        title="missing brick?"
        onclick={start}
      >
        <span aria-hidden="true">?</span>
      </button>
    {:else}
      <span class="egg-brick-mini" aria-hidden="true"></span>
    {/if}
  {/each}
</div>

{#if rebuilding}
  <div class="egg-hud bk-cut" role="status" aria-live="polite">
    <div class="egg-hud__text">
      <p class="egg-hud__title">
        {#if done}
          WALL REBUILT — nice find.
        {:else}
          RECONSTRUCTING… {placed}/{totalCells}
        {/if}
      </p>
      {#if !done && blockTotal}
        <p class="egg-hud__sub">BLOCK {blockIdx}/{blockTotal} · {blockLabel}</p>
      {/if}
    </div>
    <div
      class="bk-progress bk-cut egg-hud__bar"
      role="progressbar"
      aria-valuenow={placed}
      aria-valuemin={0}
      aria-valuemax={totalCells}
    >
      <div class="bk-progress__fill" style="width: {pct}%;"></div>
    </div>
    {#if !done}
      <button type="button" class="bricked-btn bricked-btn--sm" onclick={skip}>
        <span>Skip</span>
      </button>
    {:else}
      <button type="button" class="bricked-btn bricked-btn--sm" onclick={close}>
        <span>Admire it</span>
      </button>
    {/if}
  </div>
{/if}

<style>
  /* ---- foundation strip at the very bottom ---- */
  .egg-strip {
    display: flex;
    gap: 3px;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    padding: 10px 12px 2px;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  .egg-brick-mini {
    flex: 1 1 0;
    min-width: 14px;
    max-width: 44px;
    height: 14px;
    background: var(--orange, #ff8a1f) var(--bricks) center / 36px 18px;
    box-shadow: inset -2px -2px 0 var(--shade, #c25a00);
  }
  .egg-gap {
    flex: 1 1 0;
    min-width: 14px;
    max-width: 44px;
    height: 14px;
    padding: 0;
    border: 2px dashed var(--orange, #ff8a1f);
    background: transparent;
    color: var(--orange, #ff8a1f);
    font: 10px "Press Start 2P", monospace;
    line-height: 1;
    cursor: pointer;
    animation: egg-blink 1.2s steps(2) infinite;
  }
  .egg-gap:hover,
  .egg-gap:focus-visible {
    background: var(--orange, #ff8a1f);
    color: var(--ink, #2b1100);
    outline: none;
    box-shadow: inset -2px -2px 0 var(--shade, #c25a00);
    animation: none;
  }
  .egg-gap span {
    display: block;
    transform: translateY(-1px);
  }
  @keyframes egg-blink {
    50% { opacity: 0.35; }
  }

  /* ---- floating HUD (real layout stays visible underneath) ---- */
  .egg-hud {
    position: fixed;
    left: 50%;
    bottom: 14px;
    transform: translateX(-50%);
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 12px;
    width: min(calc(100vw - 24px), 600px);
    box-sizing: border-box;
    padding: 10px 14px 12px;
    background: var(--ink, #2b1100);
    box-shadow: inset -4px -4px 0 #000;
  }
  .egg-hud__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .egg-hud__title {
    margin: 0;
    white-space: nowrap;
    font: 10px "Press Start 2P", monospace;
    color: var(--orange, #ff8a1f);
  }
  .egg-hud__sub {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
    color: #ffd9b0;
    opacity: 0.8;
  }
  .egg-hud__bar {
    flex: 1;
    min-width: 80px;
  }

  /* ---- per-component brick covers (dynamic nodes → global selectors) ---- */
  :global(body.egg-rebuilding) {
    cursor: progress;
  }
  :global(.egg-cover) {
    position: absolute;
    inset: 0;
    z-index: 60;
    display: grid;
    gap: 3px;
    padding: 4px;
    box-sizing: border-box;
    background: var(--page-bg, #efe2cf);
    pointer-events: none;
  }
  :global(.egg-cell) {
    display: block;
    min-height: 10px;
    background: rgba(43, 17, 0, 0.3);
    box-shadow: inset 2px 2px 0 rgba(43, 17, 0, 0.5);
  }
  :global(.egg-cell.is-open) {
    /* Placed brick reveals its own spot at once: hole → matte raw →
       polished gloss → transparent onto the real component. */
    background-color: transparent;
    background-image: none;
    box-shadow: none;
    filter: none;
    animation: egg-place-reveal 0.34s steps(6) forwards;
  }
  :global(.egg-cell.is-fresh) {
    /* Newest revealed patch stays raw until the next brick lands. */
    outline: 2px dashed #fff6ea;
    outline-offset: -2px;
  }
  :global(.egg-item-done) {
    animation: egg-item-pop 0.45s steps(5);
  }
  @keyframes egg-place-reveal {
    0% {
      background: rgba(43, 17, 0, 0.3);
      box-shadow: inset 2px 2px 0 rgba(43, 17, 0, 0.5);
      transform: translateY(-8px);
      opacity: 1;
    }
    35% {
      background-color: #e07b1c;
      background-image: none;
      box-shadow:
        inset -3px -3px 0 #8a4a00,
        inset 0 0 0 2px #fff6ea;
      transform: translateY(0);
      opacity: 1;
    }
    65% {
      background-color: var(--orange, #ff8a1f);
      background-image: var(--bricks);
      background-size: 36px 18px;
      background-position: center;
      box-shadow:
        inset -3px -3px 0 var(--shade, #c25a00),
        inset 2px 2px 0 rgba(255, 255, 255, 0.35);
      filter: saturate(1.12) brightness(1.06);
      opacity: 1;
    }
    100% {
      background-color: transparent;
      background-image: none;
      box-shadow: none;
      filter: none;
      opacity: 1;
    }
  }
  @keyframes egg-item-pop {
    0% { filter: saturate(0.4) brightness(0.9); }
    100% { filter: none; }
  }
</style>
