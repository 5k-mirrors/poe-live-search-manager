import React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./containers/App/App";
import Firebase from "./components/Firebase/Firebase";
import { envIs } from "../utils/JavaScriptUtils/JavaScriptUtils";

require("electron-unhandled")({
  showDialog: envIs("development"),
});

ReactDOM.render(
  <Router>
    <Firebase>
      <App />
    </Firebase>
  </Router>,
  document.getElementById("root")
);
