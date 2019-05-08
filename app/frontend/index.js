import React, { Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppContainer as ReactHotAppContainer } from "react-hot-loader";
import App from "./containers/App/App";
import "../app.global.css";

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

/*
import { ipcMain, ipcRenderer } from "electron";
import Store from "electron-store";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../../backend/WebSockets/Actions/Actions";

const store = new Store();

export const frontend = () => {
  ipcRenderer.on(ipcEvents.MESSAGE, (_, message) => {
    const parsedMessage = JSON.parse(message);

    const currentMessages = store.get("messages") || [];

    currentMessages.unshift(parsedMessage);

    store.set("messages", currentMessages);
  });
};
*/

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
