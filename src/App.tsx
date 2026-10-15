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
          <a href="https://github.com/bricked-ui" target="_blank" rel="noreferrer">
            <PixelIcon name="code" />
            <span>GitHub</span>
          </a>
        </nav>
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
