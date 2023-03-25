import React from "react";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";

import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";
import ErrorNotification from "../../components/ErrorNotification";

import GlobalStore from "../../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../../shared/resources/StoreKeys/StoreKeys";

const globalStore = GlobalStore.getInstance();

const theme = createTheme({
  palette: {
    mode: globalStore.get(storeKeys.DARK_MODE, false) ? 'dark' : 'light',
  }
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <NavigationBar />
      <Screens />
      <ErrorNotification />
    </Container>
  </ThemeProvider>
);

export default App;
