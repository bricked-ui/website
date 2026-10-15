import { mount } from "svelte";
import "./styles/bricked.css";
import App from "./App.svelte";
import "./site.css";

mount(App, { target: document.getElementById("root")! });
