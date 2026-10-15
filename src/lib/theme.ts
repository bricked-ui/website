export type Theme = "light" | "dark" | "auto";

export function readTheme(
  storage: Pick<Storage, "getItem"> = localStorage,
): Theme {
  try {
    const t = storage.getItem("bk-theme");
    if (t === "light" || t === "dark" || t === "auto") return t;
  } catch {
    /* storage unavailable — fall through to auto */
  }
  return "auto";
}

export function applyTheme(
  t: Theme,
  doc: Document = document,
  storage: Pick<Storage, "setItem"> = localStorage,
) {
  if (t === "auto") doc.documentElement.removeAttribute("data-theme");
  else doc.documentElement.setAttribute("data-theme", t);
  try {
    storage.setItem("bk-theme", t);
  } catch {
    /* private mode etc. — theme just won't persist */
  }
}
