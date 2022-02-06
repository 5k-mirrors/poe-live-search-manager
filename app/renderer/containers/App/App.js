import React from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Container from "@mui/material/Container";

import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";

const theme = createMuiTheme();

const app = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <NavigationBar />
      <Screens />
    </Container>
  </ThemeProvider>
);

export default app;
