import React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./containers/App/App";
import { envIs } from "../shared/utils/JavaScriptUtils/JavaScriptUtils";

require("electron-unhandled")({
  showDialog: envIs("development"),
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
