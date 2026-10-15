import * as React from "react";
import logoUrl from "./assets/bricked-ui-icon.svg";
import { PixelIcon } from "./components/PixelIcon";
import { componentItems } from "./data/registry";
import { Docs } from "./pages/Docs";
import { Home } from "./pages/Home";
import { isCategory, Showcase } from "./pages/Showcase";

export function currentPath(): string {
  return window.location.hash.replace(/^#/, "") || "/";
}

export function usePath(): string {
  const [path, setPath] = React.useState<string>(currentPath);
  React.useEffect(() => {
    const onChange = () => {
      setPath(currentPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return path;
}

export type Theme = "light" | "dark" | "auto";

function readTheme(): Theme {
  try {
    const t = localStorage.getItem("bk-theme");
    if (t === "light" || t === "dark" || t === "auto") return t;
  } catch {
    /* storage unavailable — fall through to auto */
  }
  return "auto";
}

function applyTheme(t: Theme) {
  if (t === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem("bk-theme", t);
  } catch {
    /* private mode etc. — theme just won't persist */
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>(readTheme);
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {(["light", "auto", "dark"] as Theme[]).map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          className={theme === t ? "is-on" : ""}
          onClick={() => setTheme(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function Nav({ page }: { page: string }) {
  return (
    <div className="nav">
      <div className="wrap nav__in">
        <a className="nav__logo" href="#/">
          <img src={logoUrl} alt="Bricked UI logo" width={30} height={27} style={{ imageRendering: "pixelated" }} />
          BRICKED UI
        </a>
        <nav className="nav__links">
          <a href="#/" aria-current={page === "/" ? "page" : undefined}>Home</a>
          <a href="#/showcase" aria-current={page === "/showcase" ? "page" : undefined}>Showcase</a>
          <a href="#/docs" aria-current={page === "/docs" ? "page" : undefined}>Docs</a>
          <a href="https://github.com/bricked-ui" target="_blank" rel="noreferrer" aria-label="GitHub">
            <span style={{ "--icon": "1.5px" } as React.CSSProperties}>
              <PixelIcon name="github" />
            </span>
          </a>
        </nav>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function Footer({ clock }: { clock?: boolean }) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    if (!clock) return;
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, [clock]);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 12, color: "#ff8a1f" }}>BRICKED UI</p>
        <p>
          A copy-paste component kit in pixel-art brick — {componentItems.length} pieces
          and counting. Browse the <a href="#/showcase">Showcase</a>, read the{" "}
          <a href="#/docs">Docs</a>, inspect <a href="./r/registry.json">registry.json</a>,
          or star the code on{" "}
          <a href="https://github.com/bricked-ui" target="_blank" rel="noreferrer">GitHub</a>.
        </p>
        {clock && (
          <p>
            Clock: <time dateTime={now.toISOString()}>{now.toLocaleTimeString([], { hour12: false })}</time>
          </p>
        )}
      </div>
    </footer>
  );
}

export function App() {
  const path = usePath();
  const [, page, sub] = path.split("/");
  const category = isCategory(sub) ? sub : "actions";
  return (
    <div className="site-body">
      <Nav page={page === "showcase" || page === "docs" ? `/${page}` : "/"} />
      {page !== "showcase" && page !== "docs" && <Home />}
      {page === "showcase" && <Showcase category={category} />}
      {page === "docs" && <Docs />}
      <Footer clock />
    </div>
  );
}
