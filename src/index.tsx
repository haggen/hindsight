import React from "react";
import ReactDOM from "react-dom";

import { App } from "src/components/app";
import { report } from "src/lib/web-vitals";

import "src/style/global.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

/**
 * @see https://bit.ly/CRA-vitals
 */
report(console.debug);
