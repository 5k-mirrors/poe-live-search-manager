import React from "react";
import Container from "@material-ui/core/Container";
import { AuthDataProvider } from "../../contexts/AuthData";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";

const app = () => (
  <Container>
    <NavigationBar />
    <AuthDataProvider>
      <Screens />
    </AuthDataProvider>
  </Container>
);

export default app;
