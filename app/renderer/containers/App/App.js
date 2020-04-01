import React from "react";
import Container from "@material-ui/core/Container";
import {
  AuthProvider,
  SubscriptionProvider,
  PrivacyPolicyProvider,
} from "../../contexts";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";

const combineProviders = (...providers) => ({ children }) =>
  providers.reduce(
    (prev, CurrentProvider) => <CurrentProvider>{prev}</CurrentProvider>,
    children
  );

const CombinedProviders = combineProviders(
  SubscriptionProvider,
  AuthProvider,
  PrivacyPolicyProvider
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
