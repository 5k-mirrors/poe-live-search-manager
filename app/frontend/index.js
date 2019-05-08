import React, { Fragment } from "react";
import { ipcRenderer } from "electron";
import Store from "electron-store";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppContainer as ReactHotAppContainer } from "react-hot-loader";
import "../app.global.css";
import App from "./containers/App/App";
import { ipcEvents } from "../resources/IPCEvents/IPCEvents";

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

const store = new Store();

ipcRenderer.on(ipcEvents.MESSAGE, (_, message) => {
  const parsedMessage = JSON.parse(message);

  const currentMessages = store.get("messages") || [];

  currentMessages.unshift(parsedMessage);

  store.set("messages", currentMessages);
});

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
