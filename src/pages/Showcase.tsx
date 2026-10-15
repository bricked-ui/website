import * as React from "react";
import { ICONS, PixelIcon, type PixelIconName } from "../components/PixelIcon";
import { componentItems } from "../data/registry";

const KNOWN = new Set(componentItems.map((i) => i.name));

function checkCoverage(lists: string[][]) {
  const flat = lists.flat();
  const missing = componentItems
    .filter((i) => !flat.includes(i.name))
    .map((i) => i.name);
  const unknown = flat.filter((n) => !KNOWN.has(n));
  if (missing.length || unknown.length) {
    throw new Error(
      `Showcase categories out of sync with registry. missing=[${missing}] unknown=[${unknown}]`,
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
    blurb: "Twenty glyphs, each drawn on a 7×7 grid.",
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

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="demo-tag">{children}</span>;
}

function Demo({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="demo">
      <Tag>{tag}</Tag>
      {children}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bk-card bk-cut">
      <header className="bk-card__head">{title}</header>
      <div className="bk-card__body">{children}</div>
    </section>
  );
}

function Btn({
  icon,
  size,
  disabled,
  children,
  onClick,
}: {
  icon?: PixelIconName;
  size?: "sm" | "lg";
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={size ? `bricked-btn bricked-btn--${size}` : "bricked-btn"}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <PixelIcon name={icon} />}
      {children ? <span>{children}</span> : null}
    </button>
  );
}

/* ---------------------------------- widgets ---------------------------------- */

function LikeWidget() {
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
      <span>{n}</span>
      {on && (
        <span className="bk-burst" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} />
          ))}
        </span>
      )}
    </button>
  );
}

function SwitchWidget() {
  const [on, setOn] = React.useState(true);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Sound"
      className="bk-switch bk-cut"
      onClick={() => setOn(!on)}
    >
      <span className={on ? "bk-switch__opt" : "bk-switch__opt is-on"}>
        Off
      </span>
      <span className={on ? "bk-switch__opt is-on" : "bk-switch__opt"}>On</span>
    </button>
  );
}

function SliderWidget() {
  const [v, setV] = React.useState(60);
  return (
    <input
      type="range"
      className="bk-slider bk-cut"
      min={0}
      max={100}
      value={v}
      aria-label="Volume"
      style={{ "--v": `${v}%` } as React.CSSProperties}
      onChange={(e) => setV(Number(e.target.value))}
    />
  );
}

function CounterWidget() {
  const [v, setV] = React.useState(2);
  return (
    <div className="bk-count">
      <button
        type="button"
        aria-label="Less"
        className="bk-page bk-cut"
        disabled={v <= 0}
        onClick={() => setV(v - 1)}
      >
        −
      </button>
      <output className="bk-count__val bk-cut">
        {v}
      </output>
      <button
        type="button"
        aria-label="More"
        className="bk-page bk-cut"
        disabled={v >= 9}
        onClick={() => setV(v + 1)}
      >
        +
      </button>
    </div>
  );
}

function RatingWidget() {
  const [v, setV] = React.useState(4);
  return (
    <div className="bk-rate" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={v === n}
          aria-label={`${n} stars`}
          className={n <= v ? "is-on" : ""}
          onClick={() => setV(n)}
        >
          <PixelIcon name="star" />
        </button>
      ))}
    </div>
  );
}

function ChipsWidget() {
  const [items, setItems] = React.useState(["Pixel", "Orange", "Brick"]);
  return (
    <ul className="bk-chips">
      {items.map((t) => (
        <li key={t} className="bk-chip bk-cut">
          {t}
          <button
            type="button"
            aria-label={`Remove ${t}`}
            className="bk-x"
            onClick={() => setItems(items.filter((x) => x !== t))}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

function CalendarWidget() {
  const [day, setDay] = React.useState(15);
  return (
    <div className="bk-cal bk-cut">
      <p className="bk-cal__title">October 2026</p>
      <div className="bk-cal__grid">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="bk-cal__dow">
            {d}
          </span>
        ))}
        {[null, null, null, ...Array.from({ length: 31 }, (_, i) => i + 1)].map(
          (d, i) =>
            d === null ? (
              <span key={`e${i}`} />
            ) : (
              <button
                key={d}
                type="button"
                aria-pressed={d === day}
                className={d === day ? "bk-day is-on" : "bk-day"}
                onClick={() => setDay(d)}
              >
                {d}
              </button>
            ),
        )}
      </div>
    </div>
  );
}

function AccordionWidget() {
  const bodies = [
    "Orders leave within two days.",
    "Send it back within 30 days.",
    "Chat is open every day.",
  ];
  // Native disclosure: zero JS. The shared `name` keeps it single-open,
  // exactly like a controlled accordion, with free keyboard support.
  return (
    <div className="bk-acc">
      {["Shipping", "Returns", "Support"].map((t, i) => (
        <details key={t} name="showcase-accordion" open={i === 0}>
          <summary className="bk-acc__btn bk-cut">
            {t}
            <PixelIcon name="down" />
          </summary>
          <p className="bk-acc__body">{bodies[i]}</p>
        </details>
      ))}
    </div>
  );
}

function MenuWidget() {
  // Native popover: light-dismiss, Esc and top-layer come free. The only JS
  // left records which item was picked (app state, not UI plumbing).
  const [label, setLabel] = React.useState("Sort by");
  return (
    <div className="bk-menu-space">
      <div className="bk-menu">
        <button
          type="button"
          className="bricked-btn bricked-btn--sm"
          aria-haspopup="menu"
          popovertarget="sort-menu"
        >
          <span>{label}</span>
        </button>
        <div className="bk-menu__list bk-cut" role="menu" id="sort-menu" popover="auto">
          {["Newest", "Oldest", "Price"].map((it) => (
            <button
              key={it}
              type="button"
              role="menuitem"
              className="bk-menu__item"
              popovertarget="sort-menu"
              popovertargetaction="hide"
              onClick={() => setLabel(it)}
            >
              {it}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrickDialog({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open ]);
  return (
    <dialog
      ref={ref}
      className="bk-modal bk-cut"
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <header className="bk-card__head bk-modal__head">{title}</header>
      <div className="bk-card__body">{children}</div>
    </dialog>
  );
}

function ModalDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        className="bricked-btn bricked-btn--sm"
        onClick={() => setOpen(true)}
      >
        <PixelIcon name="home" />
        <span>Open modal</span>
      </button>
      <BrickDialog
        title="Delete brick?"
        open={open}
        onClose={() => setOpen(false)}
      >
          <p>This brick will be removed from your wall.</p>
          <div className="bk-row">
            <button
              className="bricked-btn bricked-btn--sm"
              onClick={() => setOpen(false)}
            >
              <span>Delete</span>
            </button>
            <button
              className="bricked-btn bricked-btn--sm"
              onClick={() => setOpen(false)}
            >
              <span>Cancel</span>
            </button>
          </div>
      </BrickDialog>
    </>
  );
}

function CopyWidget() {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      className="bricked-btn bricked-btn--sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(
            "bunx shadcn add @bricked/button",
          );
        } catch {
          /* clipboard unavailable — still flip the label */
        }
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      <PixelIcon name={done ? "check" : "plus"} />
      <span>{done ? "Copied" : "Copy"}</span>
    </button>
  );
}

const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function DiceWidget() {
  const [face, setFace] = React.useState(5);
  const [rolling, setRolling] = React.useState(false);
  const timer = React.useRef<number | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );
  return (
    <div className="bk-row">
      <div
        className="bk-die bk-cut"
        role="img"
        aria-label={`Die showing ${face}`}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className={PIPS[face].includes(i) ? "is-on" : ""} />
        ))}
      </div>
      <button
        type="button"
        className="bricked-btn bricked-btn--sm"
        disabled={rolling}
        onClick={() => {
          setRolling(true);
          let k = 0;
          timer.current = window.setInterval(() => {
            setFace(1 + Math.floor(Math.random() * 6));
            if (++k >= 8) {
              if (timer.current) window.clearInterval(timer.current);
              setRolling(false);
            }
          }, 90);
        }}
      >
        <span>Roll</span>
      </button>
      <span>You got {face}</span>
    </div>
  );
}

const TYPE_TEXT = "Hello, builder. Every wall starts with one brick.";

function TypewriterWidget() {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const t = window.setInterval(() => {
      setN((v) => (v + 1) % (TYPE_TEXT.length + 20));
    }, 60);
    return () => window.clearInterval(t);
  }, []);
  return (
    <p className="bk-type" aria-live="polite">
      {TYPE_TEXT.slice(0, Math.min(n, TYPE_TEXT.length))}
    </p>
  );
}

function LaunchWidget() {
  const [fly, setFly] = React.useState(false);
  return (
    <>
      <div className="bk-sky bk-cut" aria-hidden="true">
        <span className={fly ? "bk-rocket is-fly" : "bk-rocket"}>
          <PixelIcon name="rocket" />
        </span>
      </div>
      <div className="bk-row" style={{ marginTop: 8 }}>
        <button
          type="button"
          className="bricked-btn bricked-btn--sm"
          disabled={fly}
          onClick={() => {
            setFly(true);
            setTimeout(() => setFly(false), 1500);
          }}
        >
          <PixelIcon name="rocket" />
          <span>Launch</span>
        </button>
      </div>
    </>
  );
}

const ANSWERS = [
  "Lay one more brick.",
  "Ask again after a snack.",
  "Yes, build it.",
  "The wall says no.",
  "Take a break first.",
  "Orange is always right.",
];

function FortuneWidget() {
  const [a, setA] = React.useState("Ask me anything.");
  return (
    <>
      <div className="bk-answer bk-cut" aria-live="polite">
        {a}
      </div>
      <div className="bk-row" style={{ marginTop: 8 }}>
        <button
          type="button"
          className="bricked-btn bricked-btn--sm"
          onClick={() =>
            setA(ANSWERS[Math.floor(Math.random() * ANSWERS.length)])
          }
        >
          <PixelIcon name="star" />
          <span>Ask</span>
        </button>
      </div>
    </>
  );
}

function WallWidget() {
  const ROWS = 4;
  const COLS = 6;
  const TOTAL = ROWS * COLS;
  const [n, setN] = React.useState(0);
  return (
    <>
      <div className="demo-wall">
        <div
          className="bk-wall"
          role="img"
          aria-label={`${n} of ${TOTAL} bricks laid`}
        >
          {Array.from({ length: ROWS }, (_, r) => (
            <div
              key={r}
              className={r % 2 ? "bk-wall__row is-odd" : "bk-wall__row"}
            >
              {Array.from({ length: COLS }, (_, c) => {
                const idx = r * COLS + c;
                return <span key={c} className={idx < n ? "is-on" : ""} />;
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="bk-row" style={{ marginTop: 8 }}>
        <button
          type="button"
          className="bricked-btn bricked-btn--sm"
          disabled={n >= TOTAL}
          onClick={() => setN(Math.min(TOTAL, n + 1))}
        >
          <PixelIcon name="plus" />
          <span>Lay brick</span>
        </button>
        <button
          type="button"
          className="bricked-btn bricked-btn--sm"
          onClick={() => setN(0)}
        >
          <span>Reset</span>
        </button>
        <span>
          {n}/{TOTAL}
        </span>
      </div>
    </>
  );
}

function CountdownWidget() {
  const [s, setS] = React.useState(3661);
  React.useEffect(() => {
    const i = window.setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(i);
  }, []);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="bk-clock bk-cut" role="timer">
      <time dateTime={`PT${hh}H${mm}M${ss}S`}>{p(hh)}:{p(mm)}:{p(ss)}</time>
    </div>
  );
}

function ClockWidget() {
  const [t, setT] = React.useState(() => new Date());
  React.useEffect(() => {
    const i = window.setInterval(() => setT(new Date()), 1000);
    return () => window.clearInterval(i);
  }, []);
  return (
    <div className="bk-clock bk-cut" role="timer">
      <time dateTime={t.toISOString()}>{t.toLocaleTimeString([], { hour12: false })}</time>
    </div>
  );
}

const RING: [number, number][] = [
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 3],
  [3, 2],
  [3, 1],
  [2, 1],
];

/* Each cube gets its own delay so the ring chases instead of blinking as one. */
function RingLoader() {
  return (
    <span className="bk-spin-wrap" role="status">
      <span className="bk-brick-spin" aria-hidden="true">
        {RING.map(([r, c], i) => (
          <span
            key={i}
            style={{ gridRow: r, gridColumn: c, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </span>
      Loading
    </span>
  );
}

/* Timing lives in styles/bricked.css (bk-place-1/2/3): same 2.4s cycle for
   all three bricks, so they land one by one, vanish together, and restart. */
function StackingLoader() {
  return (
    <span className="bk-spin-wrap" role="status">
      <span className="bk-stack-load" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      Stacking
    </span>
  );
}

function TabsWidget() {
  const [tab, setTab] = React.useState("Info");
  return (
    <>
      <div className="bk-tabs" role="tablist">
        {["Info", "Specs", "Reviews"].map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className="bk-tab bk-cut"
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="bk-panel bk-cut">
        {tab === "Info"
          ? "A tough little build for everyday use."
          : tab === "Specs"
            ? "Weight: 3 kg. Fits in two rooms."
            : "Rated 4.8 by 120 builders."}
      </div>
    </>
  );
}

function ToggleGroupWidget() {
  const [on, setOn] = React.useState([true, false, false]);
  return (
    <div className="bk-row">
      {["B", "I", "U"].map((label, i) => (
        <button
          key={label}
          type="button"
          aria-pressed={on[i]}
          className={on[i] ? "bk-page bk-cut is-on" : "bk-page bk-cut"}
          onClick={() => setOn(on.map((v, j) => (j === i ? !v : v)))}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ContextMenuDemo() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return (
    <>
      <div
        className="bk-menu__list bk-cut"
        role="menu"
        hidden={!open}
        style={{ position: "static", marginTop: 8 }}
      >
        <button
          type="button"
          role="menuitem"
          className="bk-menu__item"
          onClick={() => setOpen(false)}
        >
          Copy
        </button>
        <button
          type="button"
          role="menuitem"
          className="bk-menu__item"
          onClick={() => setOpen(false)}
        >
          Delete
        </button>
      </div>
      <p style={{ margin: "8px 0 0" }}>
        Right-click{" "}
        <button
          type="button"
          className="bk-list__btn bk-cut"
          style={{ width: "auto", display: "inline-block" }}
          onContextMenu={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          this brick
        </button>{" "}
        for the context menu.
      </p>
    </>
  );
}

function CarouselWidget() {
  const [s, setS] = React.useState(1);
  return (
    <div className="bk-row" style={{ marginTop: 8 }}>
      <button
        type="button"
        className="bk-page bk-cut"
        aria-label="Previous"
        onClick={() => setS(s <= 1 ? 3 : s - 1)}
      >
        ‹
      </button>
      <span className="bk-badge bk-cut">Slide {s}/3</span>
      <button
        type="button"
        className="bk-page bk-cut"
        aria-label="Next"
        onClick={() => setS(s >= 3 ? 1 : s + 1)}
      >
        ›
      </button>
    </div>
  );
}

function CollapsibleWidget() {
  // Same story: native disclosure, no state.
  return (
    <div className="bk-acc" style={{ marginTop: 8 }}>
      <details>
        <summary className="bk-acc__btn bk-cut">More details</summary>
        <p className="bk-acc__body">mortar: #a24a00 at 30%.</p>
      </details>
    </div>
  );
}

function QuizWidget() {
  const [picked, setPicked] = React.useState(3);
  const [advanced, setAdvanced] = React.useState(false);
  return (
    <div className="bk-panel bk-cut" style={{ marginTop: 8 }}>
      <p style={{ margin: "0 0 8px" }}>
        <b>{advanced ? "Q2." : "Q1."}</b>{" "}
        {advanced ? "Which shade? Bevel knows." : "How many bricks?"}
      </p>
      <div className="bk-row">
        {[1, 3, 9].map((n) => (
          <button
            key={n}
            type="button"
            className={picked === n ? "bk-page bk-cut is-on" : "bk-page bk-cut"}
            onClick={() => {
              setPicked(n);
              setAdvanced(true);
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div className="bk-row">
        <button
          className="bricked-btn bricked-btn--sm"
          onClick={() => setOpen(true)}
        >
          <span>Open dialog</span>
        </button>
      </div>
      <BrickDialog
        title="Build wall?"
        open={open}
        onClose={() => setOpen(false)}
      >
        <p>24 bricks, zero radius.</p>
          <div className="bk-row">
            <button
              className="bricked-btn bricked-btn--sm"
              onClick={() => setOpen(false)}
            >
              <span>Build</span>
            </button>
            <button
              className="bricked-btn bricked-btn--sm"
              onClick={() => setOpen(false)}
            >
              <span>Cancel</span>
            </button>
          </div>
      </BrickDialog>
    </>
  );
}

/* ---------------------------------- sections ---------------------------------- */

function ActionsSection() {
  return (
    <Card title="Actions — buttons">
      <Demo tag='@bricked/button presets — icon="left"/"right"'>
        <div className="bk-row">
          <Btn icon="plus" size="sm">
            Add
          </Btn>
          <Btn icon="rocket">Launch</Btn>
          <Btn icon="arrow">Next</Btn>
          <Btn disabled>Saved</Btn>
        </div>
      </Demo>
      <Demo tag="@bricked/button (icon-button variant)">
        <div className="bk-row">
          <button className="bk-ibtn bk-cut" aria-label="Favorites">
            <PixelIcon name="heart" />
            <span className="bk-ibtn__dot" />
          </button>
          <button className="bk-ibtn bk-cut" aria-label="Home">
            <PixelIcon name="home" />
          </button>
          <button className="bk-ibtn bk-cut" aria-label="Cart">
            <PixelIcon name="cart" />
            <span className="bk-ibtn__dot" />
          </button>
        </div>
      </Demo>
      <Demo tag="@bricked/like-button">
        <div className="bk-row">
          <LikeWidget />
        </div>
      </Demo>
      <Demo tag='@bricked/button presets — icon="left"/"right"'>
        <div className="bk-row">
          <Btn icon="left" size="sm">
            Back
          </Btn>
          <Btn icon="right" size="sm">
            Next
          </Btn>
          <Btn icon="play" size="sm">
            Play
          </Btn>
          <Btn icon="check" size="sm">
            Save
          </Btn>
        </div>
      </Demo>
      <Demo tag="@bricked/button presets · @bricked/copy-button">
        <div className="bk-row">
          <Btn icon="cart" size="sm">
            Cart (2)
          </Btn>
          <Btn icon="rocket" size="sm">
            Launch
          </Btn>
          <Btn icon="down" size="sm">
            Load more
          </Btn>
          <Btn icon="close" size="sm">
            Delete
          </Btn>
          <CopyWidget />
        </div>
      </Demo>
    </Card>
  );
}

function IconsSection() {
  return (
    <Card title="Pixel icons">
      <Demo tag="@bricked/pixel-icon — 20 glyphs, 7×7">
        <div className="icon-grid">
          {Object.keys(ICONS).map((name) => (
            <figure key={name}>
              <PixelIcon name={name as PixelIconName} />
              <figcaption>{name}</figcaption>
            </figure>
          ))}
        </div>
      </Demo>
    </Card>
  );
}

function ContainersSection() {
  return (
    <Card title="Containers">
      <Demo tag="@bricked/card">
        <p style={{ margin: 0 }}>
          Cards group related things under a brick-orange header.
        </p>
      </Demo>
      <Demo tag="@bricked/badge · avatar">
        <div className="bk-row">
          <span className="bk-badge bk-cut">Live</span>
          <span className="bk-badge bk-cut bk-badge--dark">Beta</span>
          <span className="bk-avatar bk-cut">NX</span>
          <span className="bk-avatar bk-cut bk-avatar--dark">AB</span>
        </div>
        <div className="bk-avatars" style={{ marginTop: 8 }}>
          <span className="bk-avatar bk-cut">NX</span>
          <span className="bk-avatar bk-cut bk-avatar--dark">AB</span>
          <span className="bk-avatar bk-cut">Q</span>
        </div>
      </Demo>
      <Demo tag="@bricked/divider">
        <div className="bk-divider" role="separator">
          Snippet
        </div>
      </Demo>
      <Demo tag="@bricked/modal (dialog + sheet + confirm)">
        <ModalDemo />
        <div className="drawer-demo" style={{ marginTop: 8 }}>
          <p style={{ margin: "0 0 8px" }}>
            <b>Sheet: delete brick?</b>
          </p>
          <p style={{ margin: "0 0 8px" }}>This brick will be removed.</p>
          <div className="bk-row">
            <Btn size="sm">Delete</Btn>
            <Btn size="sm">Cancel</Btn>
          </div>
        </div>
      </Demo>
      <Demo tag="@bricked/popover">
        <div className="pop-demo">Peach preview: 3 kg, fits two rooms.</div>
      </Demo>
    </Card>
  );
}

function FeedbackSection() {
  return (
    <Card title="Feedback">
      <Demo tag="@bricked/alert">
        <div className="bk-alert bk-cut" role="alert">
          <PixelIcon name="alert" />
          <div>
            <p className="text-white!">Build failed</p>
            <p className="text-white!">Step 3 stopped. Check the log.</p>
          </div>
        </div>
      </Demo>
      <Demo tag="@bricked/banner">
        <div className="bk-banner bk-cut" role="status">
          <PixelIcon name="star" />
          <span>New bricks just landed.</span>
        </div>
        <div className="bk-toast bk-cut" role="status" style={{ marginTop: 8 }}>
          <PixelIcon name="alert" />
          <span>You are offline. Keep laying.</span>
        </div>
      </Demo>
      <Demo tag="@bricked/toast">
        <div className="bk-toast bk-cut" role="status">
          <PixelIcon name="check" />
          <span>Changes saved</span>
        </div>
        <div className="bk-toast bk-cut" role="status" style={{ marginTop: 8 }}>
          <PixelIcon name="check" />
          <span>v2.4 ready — reload to update.</span>
        </div>
      </Demo>
      <Demo tag="@bricked/progress (bar + ring)">
        <div
          className="bk-progress bk-cut"
          role="progressbar"
          aria-valuenow={60}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="bk-progress__fill" style={{ width: "60%" }} />
        </div>
        <div className="bk-row" style={{ marginTop: 8 }}>
          <span className="bk-badge bk-cut">60%</span>
          <span className="bk-badge bk-cut bk-badge--dark">● live</span>
        </div>
      </Demo>
      <Demo tag="@bricked/skeleton · @bricked/ring-loader · stacking-loader">
        <div className="bk-row">
          <RingLoader />
        </div>
        <div className="bk-row" style={{ marginTop: 8 }}>
          <StackingLoader />
        </div>
        <div
          className="bk-skel-row"
          aria-hidden="true"
          style={{ marginTop: 8 }}
        >
          <div className="bk-skel bk-skel--box bk-cut" />
          <div className="bk-skel-lines">
            <div className="bk-skel" style={{ width: "100%" }} />
            <div className="bk-skel" style={{ width: "80%" }} />
            <div className="bk-skel" style={{ width: "55%" }} />
          </div>
        </div>
      </Demo>
    </Card>
  );
}

function FormsSection() {
  return (
    <Card title="Forms">
      <Demo tag="@bricked/field (label + hint) · @bricked/input">
        <div className="bk-field">
          <label className="bk-label" htmlFor="d-name">
            Name
          </label>
          <input
            id="d-name"
            className="bk-input bk-cut"
            placeholder="Your name"
          />
          <span>3–12 characters, please.</span>
        </div>
      </Demo>
      <Demo tag="@bricked/textarea">
        <textarea className="bk-input bk-cut" placeholder="Write something" />
      </Demo>
      <Demo tag="@bricked/select · @bricked/input (search + date variants)">
        <div className="bk-select">
          <select
            className="bk-input bk-cut"
            aria-label="Role"
            defaultValue="Builder"
          >
            <option>Builder</option>
            <option>Designer</option>
            <option>Tester</option>
          </select>
          <PixelIcon name="down" />
        </div>
        <div className="bk-search" style={{ marginTop: 8 }}>
          <input
            type="search"
            className="bk-input bk-cut"
            placeholder="Search bricks"
            aria-label="Search"
          />
          <PixelIcon name="search" />
        </div>
        <label className="bk-drop bk-cut" style={{ marginTop: 8 }}>
          <input type="file" />
          <PixelIcon name="upload" />
          <span>Choose a file</span>
        </label>
      </Demo>
      <Demo tag="@bricked/checkbox · radio · @bricked/switch (incl. toggle)">
        <label className="bk-check">
          <input type="checkbox" defaultChecked />
          <span className="bk-check__box bk-cut">
            <PixelIcon name="check" />
          </span>
          Accept terms
        </label>
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
          <legend className="bk-label">Plan</legend>
          <div className="bk-row" style={{ marginTop: 8 }}>
            <label className="bk-check">
              <input type="radio" name="dplan" defaultChecked />
              <span className="bk-check__box bk-round">
                <PixelIcon name="dot" />
              </span>
              Free
            </label>
            <label className="bk-check">
              <input type="radio" name="dplan" />
              <span className="bk-check__box bk-round">
                <PixelIcon name="dot" />
              </span>
              Pro
            </label>
          </div>
        </fieldset>
        <div className="bk-row" style={{ marginTop: 8 }}>
          <SwitchWidget />
          <span>Sound</span>
        </div>
      </Demo>
      <Demo tag="@bricked/slider · counter · rating">
        <SliderWidget />
        <div className="bk-row" style={{ marginTop: 8 }}>
          <CounterWidget />
          <RatingWidget />
        </div>
      </Demo>
      <Demo tag="@bricked/chips · keycap · color-picker · otp-input">
        <ChipsWidget />
        <div className="bk-keys" style={{ marginTop: 8 }}>
          <kbd className="bk-key bk-cut">Ctrl</kbd>
          <span>+</span>
          <kbd className="bk-key bk-cut">K</kbd>
        </div>
        <div className="sw-row" style={{ marginTop: 8 }}>
          {(
            ["#ff8a1f", "#2b1100", "#fff6ea", "#ffd3a1", "#d63a1f"] as const
          ).map((c) => (
            <button
              key={c}
              type="button"
              className="sw-dot"
              style={{ background: c }}
              aria-label={c}
            />
          ))}
        </div>
        <div className="otp-row" style={{ marginTop: 8 }}>
          {["4", "0", "4", "2"].map((d, i) => (
            <input
              key={i}
              className="bk-input bk-cut"
              maxLength={1}
              defaultValue={d}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>
      </Demo>
        <Demo tag="@bricked/list-group">
          <ul className="bk-list">
            <li>
              <button
                type="button"
                className="bk-list__btn bk-cut"
                aria-pressed="true"
              >
                Inbox
              </button>
            </li>
            <li>
              <button
                type="button"
                className="bk-list__btn bk-cut"
                aria-pressed="false"
              >
                Drafts
              </button>
            </li>
            <li>
              <button
                type="button"
                className="bk-list__btn bk-cut"
                aria-pressed="false"
              >
                Sent
              </button>
            </li>
          </ul>
        </Demo>
    </Card>
  );
}

function NavigationSection() {
  return (
    <Card title="Navigation">
      <Demo tag="@bricked/tabs">
        <TabsWidget />
      </Demo>
      <Demo tag="@bricked/accordion">
        <AccordionWidget />
      </Demo>
      <Demo tag="@bricked/breadcrumbs">
        <nav aria-label="Breadcrumb">
          <ol className="bk-crumbs">
            <li className="bk-crumbs__item">
              <a href="#/showcase" onClick={(e) => e.preventDefault()}>
                Home
              </a>
            </li>
            <li className="bk-crumbs__item">
              <a href="#/showcase" onClick={(e) => e.preventDefault()}>
                Shop
              </a>
            </li>
            <li className="bk-crumbs__item">
              <span className="bk-crumb--current bk-cut" aria-current="page">
                Bricks
              </span>
            </li>
          </ol>
        </nav>
      </Demo>
      <Demo tag="@bricked/pagination">
        <nav className="bk-pages" aria-label="Pagination">
          <button className="bk-page bk-cut">1</button>
          <button className="bk-page bk-cut is-on">2</button>
          <button className="bk-page bk-cut">3</button>
        </nav>
        <div className="dots" style={{ marginTop: 8 }}>
          <span />
          <span className="is-on" />
          <span />
          <span />
        </div>
      </Demo>
      <Demo tag="@bricked/stepper">
        <ol className="bk-steps">
          <li className="bk-step bk-step--done">
            <span className="bk-step__box bk-cut">✓</span>
            <span>Cart</span>
          </li>
          <li className="bk-step__line is-done" aria-hidden="true" />
          <li className="bk-step bk-step--now" aria-current="step">
            <span className="bk-step__box bk-cut">2</span>
            <span>Ship</span>
          </li>
          <li className="bk-step__line" aria-hidden="true" />
          <li className="bk-step bk-step--todo">
            <span className="bk-step__box bk-cut">3</span>
            <span>Pay</span>
          </li>
        </ol>
      </Demo>
      <Demo tag="@bricked/dropdown-menu · @bricked/command-palette">
        <MenuWidget />
      </Demo>
      <Demo tag="@bricked/scroll-area">
        <div className="scroll-demo">
          <p>Row one of many scrollable rows.</p>
          <p>Row two keeps the bevel honest.</p>
          <p>Row three still snaps to pixels.</p>
          <p>Row four never rounds a corner.</p>
        </div>
      </Demo>
      <Demo tag="@bricked/list-group · tooltip · @bricked/button">
        <span className="bk-tip">
          <Btn size="sm">Hint</Btn>
          <span className="bk-tip__bubble bk-cut" role="tooltip">
            Saves to the cloud
          </span>
        </span>
      </Demo>
    </Card>
  );
}

function DataSection() {
  return (
    <Card title="Data & time">
      <Demo tag="@bricked/data-table">
        <div className="bk-table-wrap bk-cut">
          <table className="bk-table">
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
        <div className="bk-meter">
          <p className="bk-meter__label">HP 7/10</p>
          <div className="bk-meter__bar">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={i < 7 ? "is-on" : ""} />
            ))}
          </div>
        </div>
      </Demo>
      <Demo tag="@bricked/calendar · date-picker">
        <CalendarWidget />
      </Demo>
      <Demo tag="@bricked/timeline">
        <ol className="bk-tl">
          {[
            ["Order placed", "Mon, 9:00"],
            ["Packed", "Tue, 14:30"],
            ["On the way", "Thu, 8:15"],
          ].map(([title, time]) => (
            <li key={title}>
              <span className="bk-tl__dot" />
              <div>
                <p className="bk-tl__title">{title}</p>
                <p>{time}</p>
              </div>
            </li>
          ))}
        </ol>
      </Demo>
      <Demo tag="@bricked/clock · countdown · stat-card · leaderboard">
        <ClockWidget />
        <div style={{ marginTop: 8 }}>
          <CountdownWidget />
        </div>
        <div className="bk-stat bk-cut" style={{ marginTop: 8 }}>
          <p>Bricks laid</p>
          <p className="bk-stat__value">1,284</p>
          <span className="bk-badge bk-cut">+12%</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <div className="lb-row">
            <span>1 · Ada</span>
            <span>9,410</span>
          </div>
          <div className="lb-row">
            <span>2 · Bo</span>
            <span>8,025</span>
          </div>
          <div className="lb-row">
            <span>3 · Cy</span>
            <span>7,300</span>
          </div>
        </div>
        <p style={{ margin: "8px 0 0" }}>
          $42.50 — VT323 price, coin not included.
        </p>
      </Demo>
      <Demo tag="@bricked/code-block · empty-state">
        <pre className="bk-code bk-cut">
          <code>
            <span className="bk-code__k">const</span> brick ={" "}
            <span className="bk-code__s">&quot;orange&quot;</span>;{"\n"}
            <span className="bk-code__k">build</span>(brick);
          </code>
        </pre>
        <div className="bk-empty bk-cut" style={{ marginTop: 8 }}>
          <p className="bk-empty__title">Cart is empty</p>
          <p>Nothing here yet.</p>
          <Btn icon="plus" size="sm">
            Add item
          </Btn>
        </div>
      </Demo>
    </Card>
  );
}

function FunSection() {
  return (
    <Card title="Fun — wall builder & friends">
      <Demo tag="@bricked/wall-builder">
        <WallWidget />
      </Demo>
      <Demo tag="@bricked/dice · coin-flip">
        <DiceWidget />
      </Demo>
      <Demo tag="@bricked/typewriter">
        <TypewriterWidget />
      </Demo>
      <Demo tag="@bricked/launch-pad">
        <LaunchWidget />
      </Demo>
      <Demo tag="@bricked/fortune">
        <FortuneWidget />
        <div className="bk-row" style={{ marginTop: 8 }}>
          <span className="bk-badge bk-cut">First wall ★</span>
          <span className="bk-badge bk-cut bk-badge--dark">Score 1284</span>
        </div>
        <ul className="bk-list" style={{ marginTop: 8 }}>
          <li>
            <button
              type="button"
              className="bk-list__btn bk-cut"
              aria-pressed="true"
            >
              Lay 10 bricks — done ✓
            </button>
          </li>
          <li>
            <button
              type="button"
              className="bk-list__btn bk-cut"
              aria-pressed="false"
            >
              Build a wall — 0/24
            </button>
          </li>
        </ul>
      </Demo>
    </Card>
  );
}

function ParitySection() {
  return (
    <Card title="Shadcn parity — chat, overlays & layout">
      <Demo tag="@bricked/dialog · alert-dialog · sheet · drawer · sidebar">
        <DialogDemo />
        <div className="drawer-demo" style={{ marginTop: 8 }}>
          <p style={{ margin: "0 0 4px" }}>
            <b>Sheet</b>
          </p>
          <p style={{ margin: 0 }}>Complements the main content.</p>
        </div>
        <div className="mini-side" style={{ marginTop: 8 }}>
          <button
            type="button"
            className="bk-list__btn bk-cut"
            aria-pressed="true"
          >
            Dashboard
          </button>
          <button
            type="button"
            className="bk-list__btn bk-cut"
            aria-pressed="false"
          >
            Bricks
          </button>
          <button
            type="button"
            className="bk-list__btn bk-cut"
            aria-pressed="false"
          >
            Settings
          </button>
        </div>
      </Demo>
      <Demo tag="@bricked/message · bubble · message-scroller · marker · trace">
        <div className="scroll-demo" style={{ height: 150 }}>
          <p style={{ margin: "0 0 8px" }}>
            <b>Ada:</b> Wall is up.{" "}
            <span className="bk-badge bk-cut">seen</span>
          </p>
          <p style={{ margin: "0 0 8px" }}>
            <b>You:</b> Lay one more brick.
          </p>
          <p style={{ margin: 0 }}>
            <b>Wall:</b> Orange is always right.
          </p>
        </div>
        <pre className="bk-code bk-cut" style={{ marginTop: 8 }}>
          trace: thought “one more brick” → tool lay_brick(1) → ok
        </pre>
      </Demo>
      <Demo tag="@bricked/button-group · toggle-group · radio-group · menubar · navigation-menu · context-menu">
        <div className="bk-row">
          <Btn size="sm">Cut</Btn>
          <Btn size="sm">Copy</Btn>
          <Btn size="sm">Lay</Btn>
        </div>
        <div style={{ marginTop: 8 }}>
          <ToggleGroupWidget />
        </div>
        <div className="mini-nav" style={{ marginTop: 8 }}>
          <span>File</span>
          <a href="#/showcase" onClick={(e) => e.preventDefault()}>
            Edit
          </a>
          <a href="#/showcase" onClick={(e) => e.preventDefault()}>
            View
          </a>
          <a href="#/showcase" onClick={(e) => e.preventDefault()}>
            Build
          </a>
        </div>
        <ContextMenuDemo />
      </Demo>
      <Demo tag="@bricked/chart · carousel · collapsible · questionnaire">
        <div
          className="bk-row"
          style={{ alignItems: "flex-end" }}
          aria-label="Weekly bricks laid"
        >
          {[24, 48, 36, 60].map((h) => (
            <span
              key={h}
              style={{
                width: 28,
                height: h,
                background: "var(--orange)",
                boxShadow: "inset -3px -3px 0 var(--shade)",
              }}
            />
          ))}
          <span
            style={{
              width: 28,
              height: 44,
              background: "var(--field)",
              boxShadow: "inset 3px 3px 0 var(--shade)",
            }}
          />
        </div>
        <CarouselWidget />
        <CollapsibleWidget />
        <QuizWidget />
      </Demo>
      <Demo tag="@bricked/item · attachment · input-group · separator · aspect-ratio · resizable · hover-card · typography · direction · spinner">
        <div className="bk-row">
          <div className="bk-chip bk-cut">
            wall.png · 12 KB
            <button type="button" aria-label="Remove file" className="bk-x">
              ×
            </button>
          </div>
        </div>
        <div className="bk-row" style={{ marginTop: 8 }}>
          <input
            className="bk-input bk-cut"
            defaultValue="wall"
            aria-label="Name"
            style={{ flex: "1 1 200px", minWidth: 0 }}
          />
          <Btn size="sm">Save</Btn>
        </div>
        <div
          style={{
            height: 4,
            marginTop: 12,
            background:
              "repeating-linear-gradient(90deg, var(--shade) 0 4px, transparent 4px 8px)",
          }}
          role="separator"
        />
        <div className="bk-row" style={{ marginTop: 8 }}>
          <div
            className="bk-panel bk-cut"
            style={{
              aspectRatio: "16/9",
              display: "grid",
              placeItems: "center",
              minWidth: 160,
            }}
          >
            16 / 9
          </div>
          <div
            className="scroll-demo"
            style={{
              height: 80,
              minWidth: 160,
              resize: "horizontal",
              overflow: "auto",
            }}
          >
            Drag my corner — resizable.
          </div>
        </div>
        <div className="pop-demo" style={{ marginTop: 8 }}>
          <b>Brick</b>
          <p style={{ margin: "4px 0 0" }}>A 16×8 pixel of pure orange.</p>
        </div>
        <div style={{ marginTop: 8 }} dir="rtl">
          <p style={{ margin: 0 }}>rtl: הבית בנוי מלבנים.</p>
        </div>
      </Demo>
    </Card>
  );
}

/* ---------------------------------- page ---------------------------------- */

const SECTIONS: Record<CategoryId, () => React.JSX.Element> = {
  actions: ActionsSection,
  icons: IconsSection,
  containers: ContainersSection,
  feedback: FeedbackSection,
  forms: FormsSection,
  navigation: NavigationSection,
  data: DataSection,
  fun: FunSection,
  parity: ParitySection,
};

export function Showcase({ category }: { category: CategoryId }) {
  const Section = SECTIONS[category];
  const meta = CATEGORIES.find((c) => c.id === category)!;
  return (
    <>
      <header className="wrap page-head">
        <span className="hero__kicker">
          SHOWCASE · {componentItems.length} PIECES
        </span>
        <h1>Every component, live.</h1>
        <p>
          Same CSS your app gets. Names match <code>@bricked/name</code>.
          Install any piece with one command — see <a href="#/docs">Docs</a>.
        </p>
      </header>

      <main>
        <section className="section">
          <div className="wrap">
            <h2>{meta.label}</h2>
            <p className="sub">
              {meta.blurb} {meta.items.length} installable pieces on this shelf.
            </p>
            <div className="show-layout">
              <aside className="show-side" aria-label="Categories">
                <ul className="bk-list">
                  {CATEGORIES.map((c) => (
                    <li key={c.id}>
                      <a
                        href={`#/showcase/${c.id}`}
                        aria-current={c.id === category ? "page" : undefined}
                        aria-pressed={c.id === category}
                        className="bk-list__btn bk-cut"
                        style={{ display: "block", textDecoration: "none" }}
                      >
                        {c.label} · {c.items.length}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
              <div className="show-main">
                <Section />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
