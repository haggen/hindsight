import "preact/debug";

import { render } from "preact";
import { App } from "~/src/components/App";
const root = document.getElementById("root");

if (!root) {
	throw new Error("Root element not found");
}

render(<App />, root);
