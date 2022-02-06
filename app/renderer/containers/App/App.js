import React from "react";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";

import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";

const theme = createTheme();

const app = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <NavigationBar />
      <Screens />
    </Container>
  </ThemeProvider>
);

export default app;
