import React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./containers/App/App";
import Firebase from "./components/Firebase/Firebase";

require("electron-unhandled")({
  showDialog: false,
});

ReactDOM.render(
  <Router>
    <Firebase>
      <App />
    </Firebase>
  </Router>,
  document.getElementById("root")
);
