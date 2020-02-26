import React from "react";
import Container from "@material-ui/core/Container";
import {
  AuthProvider,
  SubscriptionProvider,
  PrivacyPolicyProvider,
} from "../../contexts";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";
import PrivacyPolicyAcceptanceDialog from "../../components/PrivacyPolicyAcceptanceDialog/PrivacyPolicyAcceptanceDialog";

const CombinedProviders = ({ children }) => (
  <PrivacyPolicyProvider>
    <AuthProvider>
      <SubscriptionProvider>{children}</SubscriptionProvider>
    </AuthProvider>
  </PrivacyPolicyProvider>
);

const app = () => (
  <Container>
    <NavigationBar />
    <CombinedProviders>
      <PrivacyPolicyAcceptanceDialog />
      <Screens />
    </CombinedProviders>
  </Container>
);

export default app;
