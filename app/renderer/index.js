import React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./containers/App/App";
import setupIPCEvents from "./SetupIPCEvents/SetupIPCEvents";
import * as firebaseUtils from "./utils/FirebaseUtils/FirebaseUtils";

setupIPCEvents();

firebaseUtils.initializeApp();
firebaseUtils.startAuthObserver();

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
