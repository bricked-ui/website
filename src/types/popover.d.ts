// Popover API attributes landed in React's own types with v19; this project
// pins React 18, so augment the JSX attributes locally instead of churning
// the React major for three attributes.
import "react";

declare module "react" {
  interface ButtonHTMLAttributes<T> {
    popovertarget?: string;
    popovertargetaction?: "hide" | "show" | "toggle";
  }
  interface HTMLAttributes<T> {
    popover?: "" | "auto" | "manual";
  }
}
