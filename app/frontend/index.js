import React, { Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppContainer as ReactHotAppContainer } from "react-hot-loader";
import Screens from "./containers/Screens/Screens";
import "../app.global.css";

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

render(
  <BrowserRouter>
    <AppContainer>
      <Screens />
    </AppContainer>
  </BrowserRouter>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept("./containers/Screens/Screens", () => {
    // eslint-disable-next-line global-require
    const NextScreens = require("./containers/Screens/Screens").default;
    render(
      <BrowserRouter>
        <AppContainer>
          <NextScreens />
        </AppContainer>
      </BrowserRouter>,
      document.getElementById("root")
    );
  });
}
