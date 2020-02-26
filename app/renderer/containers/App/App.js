import React from "react";
import Container from "@material-ui/core/Container";
import { AuthProvider, SubscriptionProvider } from "../../contexts";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Screens from "../../components/Screens/Screens";
import PrivacyPolicyAcceptanceDialog from "../../components/PrivacyPolicyAcceptanceDialog/PrivacyPolicyAcceptanceDialog";

const CombinedProviders = ({ children }) => (
  <AuthProvider>
    <SubscriptionProvider>{children}</SubscriptionProvider>
  </AuthProvider>
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
