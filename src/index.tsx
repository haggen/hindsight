import { render } from "preact";

import "./global.css";

import { App } from "~/components/App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

render(<App />, root);
