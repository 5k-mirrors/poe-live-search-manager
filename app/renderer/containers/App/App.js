import React from "react";
import Container from "@material-ui/core/Container";
import { AuthProvider } from "../../contexts/Auth";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";

const app = () => (
  <Container>
    <NavigationBar />
    <AuthProvider>
      <Screens />
    </AuthProvider>
  </Container>
);

export default app;
