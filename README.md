# Bricked UI - website

The marketing site, showcase and docs for Bricked UI. Svelte 5 + Vite SPA
(hash-routed, so `dist/` serves from any static host). Live at
https://bricked-ui.vercel.app. Registry source lives in the
[ui repo](https://github.com/bricked-ui/ui).

## Routes

| Hash          | Page     |
| ------------- | -------- |
| `#/`          | Home - hero, 60-second setup, tasters |
| `#/showcase/*`| Showcase - one shelf per category, sidebar-navigated |
| `#/docs`      | Docs - quickstart, theming, filterable registry reference |

## Layout

```
website/
  index.html               # single SPA entry
  public/
    favicon.svg            # site logo
    r/                     # built React registry JSON (generated, served at /r/*.json)
    r-svelte/              # built Svelte registry JSON (generated, served at /r-svelte/*.json)
  src/
    main.ts                # entry: styles + mount <App/>
    App.svelte             # hash router, nav, theme toggle, footer
    lib/theme.ts           # light/dark/auto theme read + apply
    styles/bricked.css     # the kit as Tailwind v4 (@theme, @utility, @layer)
    site.css               # page chrome
    pages/                 # Home, Showcase, Docs (+ TunePanel/SourcePanel/InstallSnippet)
    components/            # pixel-icon + icons (vendored), Card/Demo/Btn/CodeBlock
    data/                  # registry.json, svelte.json (vendored)
    assets/                # logo svg
  scripts/sync-ui.ts       # refresh vendored files from ../ui
```

## Develop

```sh
bun install
bun run dev       # http://localhost:5173
bun run check     # svelte-check
bun run build     # check + vite build -> dist/
bun run preview
bun run sync-ui   # re-vendor registry.json + pixel-icon.svelte + icons.ts from ../ui
```

Where native HTML does the job, it does it: `<dialog>` modals,
`<details>` accordions, popover menus, `<output>`, `<ul>` lists -
JS stays for timers, picks and genuinely dynamic state.

## Self-containment

Everything under `src/` is vendored into this repo - styles, icons and the
registry catalogs. Nothing is imported from `../ui` at build or runtime, so
`dist/` deploys anywhere (currently Vercel). The registry JSON in
`public/r/` is rebuilt from the ui repo via its `bun run build`, and
`public/r-svelte/` via `bun run registry:build` in `ui/svelte` - both output
directly here.

## Design rules (enforced, not suggested)

Flat colors only. No border-radius, borders or blur. Cut corners, hard inset
bevels, `steps()` motion. Ink text on orange. Pixel icons on a grid.
