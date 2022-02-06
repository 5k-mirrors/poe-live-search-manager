import React from "react";
import Container from "@material-ui/core/Container";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";

const app = () => (
  <Container>
    <NavigationBar />
    <Screens />
  </Container>
);

export default app;
