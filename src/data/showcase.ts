// Showcase shelves. Coverage is checked against the vendored registry
// catalog so categories can never drift from what shadcn publishes.
import { componentItems } from "./registry";

const KNOWN = new Set(componentItems.map((i) => i.name));

function checkCoverage(lists: string[][]) {
  const flat = lists.flat();
  const missing = componentItems
    .filter((i) => !flat.includes(i.name))
    .map((i) => i.name);
  const unknown = flat.filter((n) => !KNOWN.has(n));
  if (missing.length || unknown.length) {
    throw new Error(
      `Showcase categories out of sync with registry. missing=[${missing}] unknown=[${unknown}]`
    );
  }
}

export const CATEGORIES = [
  {
    id: "actions",
    label: "Actions",
    blurb: "Buttons that feel like pressing a real key.",
    items: ["button", "like-button", "copy-button"],
  },
  {
    id: "icons",
    label: "Icons",
    blurb: "Twenty-two glyphs, each drawn on a pixel grid.",
    items: ["pixel-icon"],
  },
  {
    id: "containers",
    label: "Containers",
    blurb: "Cards, dialogs, and everything that holds stuff.",
    items: [
      "card",
      "modal",
      "alert",
      "toast",
      "banner",
      "stat-card",
      "empty-state",
      "divider",
      "code-block",
      "tooltip",
      "dropdown-menu",
      "list-group",
      "avatar",
      "badge",
      "popover",
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    blurb: "Tell people what just happened.",
    items: [
      "progress",
      "health-meter",
      "skeleton",
      "ring-loader",
      "stacking-loader",
      "spinner",
    ],
  },
  {
    id: "forms",
    label: "Forms",
    blurb: "Inputs, checks, sliders, and pickers.",
    items: [
      "input",
      "textarea",
      "select",
      "checkbox",
      "radio",
      "switch",
      "slider",
      "counter",
      "rating",
      "dropzone",
      "chips",
      "keycap",
      "field",
      "otp-input",
      "combo-box",
      "color-picker",
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    blurb: "Move around the app.",
    items: [
      "tabs",
      "accordion",
      "breadcrumbs",
      "pagination",
      "stepper",
      "command-palette",
      "scroll-area",
      "sidebar-rail",
    ],
  },
  {
    id: "data",
    label: "Data & time",
    blurb: "Tables, calendars, clocks, and counts.",
    items: [
      "data-table",
      "calendar",
      "timeline",
      "clock",
      "countdown",
      "date-picker",
      "leaderboard",
    ],
  },
  {
    id: "fun",
    label: "Fun & games",
    blurb: "Toys. Every kit needs toys.",
    items: [
      "wall-builder",
      "dice",
      "typewriter",
      "launch-pad",
      "fortune",
      "coin-flip",
    ],
  },
  {
    id: "parity",
    label: "Shadcn parity",
    blurb: "The full shadcn roster, rebuilt in brick.",
    items: [
      "alert-dialog",
      "aspect-ratio",
      "attachment",
      "bubble",
      "button-group",
      "carousel",
      "chart",
      "collapsible",
      "context-menu",
      "dialog",
      "direction",
      "drawer",
      "hover-card",
      "input-group",
      "item",
      "marker",
      "menubar",
      "message",
      "message-scroller",
      "navigation-menu",
      "questionnaire",
      "radio-group",
      "resizable",
      "separator",
      "sheet",
      "sidebar",
      "toggle-group",
      "trace",
      "typography",
    ],
  },
] as const;

checkCoverage(CATEGORIES.map((c) => [...c.items]));

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function isCategory(id: string | undefined): id is CategoryId {
  return CATEGORIES.some((c) => c.id === id);
}
