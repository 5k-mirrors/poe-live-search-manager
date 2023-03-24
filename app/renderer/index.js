import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";

import App from "./containers/App/App";
import { envIs } from "../shared/utils/JavaScriptUtils/JavaScriptUtils";

require("electron-unhandled")({
  showDialog: envIs("development"),
});

const root = createRoot(document.getElementById("root"));

root.render(
  <MemoryRouter initialEntries={["/news"]}>
    <App />
  </MemoryRouter>
);
