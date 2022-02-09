import React from "react";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";

import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";
import ErrorNotification from "../../components/ErrorNotification";

const theme = createTheme();

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
