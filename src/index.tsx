import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./global.css";

import { App } from "~/components/App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
