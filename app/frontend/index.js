import React, { Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppContainer as ReactHotAppContainer } from "react-hot-loader";
import "../app.global.css";
import App from "./containers/App/App";
import SetupIPCEvents from "./SetupIPCEvents/SetupIPCEvents";
import * as FirebaseUtils from "./utils/FirebaseUtils/FirebaseUtils";

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

SetupIPCEvents();
FirebaseUtils.startAuthObserver();

render(
  <BrowserRouter>
    <AppContainer>
      <App />
    </AppContainer>
  </BrowserRouter>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept("./containers/App/App", () => {
    // eslint-disable-next-line global-require
    const NextApp = require("./containers/App/App").default;
    render(
      <BrowserRouter>
        <AppContainer>
          <NextApp />
        </AppContainer>
      </BrowserRouter>,
      document.getElementById("root")
    );
  });
}
