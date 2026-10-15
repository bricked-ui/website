import * as React from "react";
import { createRoot } from "react-dom/client";
import "./styles/bricked.css";
import { App } from "./App";
import "./site.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
