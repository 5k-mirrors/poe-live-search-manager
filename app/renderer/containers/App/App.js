import React from "react";
import Container from "@material-ui/core/Container";
import { AuthDataProvider, SubscriptionDataProvider } from "../../contexts";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";

const CombinedProviders = ({ children }) => (
  <AuthDataProvider>
    <SubscriptionDataProvider>{children}</SubscriptionDataProvider>
  </AuthDataProvider>
);

const app = () => (
  <Container>
    <NavigationBar />
    <CombinedProviders>
      <Screens />
    </CombinedProviders>
  </Container>
);

export default app;
