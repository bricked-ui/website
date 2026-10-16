<script lang="ts">
  import { onMount } from "svelte";
  import logoUrl from "./assets/bricked-ui-icon.svg";
  import PixelIcon from "./components/pixel-icon.svelte";
  import { componentItems } from "./data/registry";
  import { isCategory, type CategoryId } from "./data/showcase";
  import { applyTheme, readTheme, type Theme } from "./lib/theme";
  import Docs from "./pages/Docs.svelte";
  import Home from "./pages/Home.svelte";
  import Showcase from "./pages/Showcase.svelte";
  import EasterEgg from "./components/EasterEgg.svelte";

  function currentPath(): string {
    return window.location.hash.replace(/^#/, "") || "/";
  }

  let path = $state("/");
  let theme = $state<Theme>("auto");

  onMount(() => {
    theme = readTheme();
    path = currentPath();
    const onChange = () => {
      path = currentPath();
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  });

  $effect(() => {
    applyTheme(theme);
  });

  // Footer clock
  let now = $state(new Date());
  onMount(() => {
    const i = setInterval(() => (now = new Date()), 1000);
    return () => clearInterval(i);
  });

  const parts = $derived(path.split("/"));
  const page = $derived(parts[1] ?? "");
  const category = $derived<CategoryId>(
    isCategory(parts[2]) ? parts[2] : "actions"
  );
  const navPage = $derived(
    page === "showcase" || page === "docs" ? `/${page}` : "/"
  );
</script>

<div class="site-body">
  <div class="nav">
    <div class="wrap nav__in">
      <a class="nav__logo" href="#/">
        <img
          src={logoUrl}
          alt="Bricked UI logo"
          width={30}
          height={27}
          style="image-rendering: pixelated;"
        />
        BRICKED UI
      </a>
      <nav class="nav__links">
        <a href="#/" aria-current={navPage === "/" ? "page" : undefined}>Home</a>
        <a
          href="#/showcase"
          aria-current={navPage === "/showcase" ? "page" : undefined}
        >
          Showcase
        </a>
        <a href="#/docs" aria-current={navPage === "/docs" ? "page" : undefined}>
          Docs
        </a>
        <a
          href="https://github.com/bricked-ui"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <span style="--icon: 1.5px;">
            <PixelIcon name="github" />
          </span>
        </a>
      </nav>
      <div class="theme-toggle" role="group" aria-label="Color theme">
        {#each ["light", "auto", "dark"] as t}
          <button
            type="button"
            aria-pressed={theme === t}
            class={theme === t ? "is-on" : ""}
            onclick={() => (theme = t as Theme)}
          >
            {t}
          </button>
        {/each}
      </div>
    </div>
  </div>

  {#if page !== "showcase" && page !== "docs"}
    <Home />
  {:else if page === "showcase"}
    <Showcase {category} />
  {:else}
    <Docs />
  {/if}

  <footer class="site-footer">
    <div class="wrap">
      <p
        style="font-family: 'Press Start 2P',monospace; font-size: 12px; color: #ff8a1f;"
      >
        BRICKED UI
      </p>
      <p>
        A copy-paste component kit in pixel-art brick — {componentItems.length}
        React pieces plus a 50-piece Svelte registry. Browse the
        <a href="#/showcase">Showcase</a>, read the
        <a href="#/docs">Docs</a>, inspect
        <a href="./r/registry.json">registry.json</a> (or
        <a href="./r-svelte/button.json">r-svelte</a>), or star the code on
        <a href="https://github.com/bricked-ui" target="_blank" rel="noreferrer">
          GitHub
        </a>.
      </p>
      <p>
        Clock:
        <time datetime={now.toISOString()}>
          {now.toLocaleTimeString([], { hour12: false })}
        </time>
      </p>
      <EasterEgg />
    </div>
  </footer>
</div>
