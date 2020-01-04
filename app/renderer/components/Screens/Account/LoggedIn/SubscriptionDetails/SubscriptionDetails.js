import React from "react";
import Box from "@material-ui/core/Box";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import {
  useAuthContext,
  useSubscriptionContext,
} from "../../../../../contexts";
import { useDisable } from "../../../../../utils/CustomHooks/CustomHooks";

export default () => {
  const auth = useAuthContext();
  const [subscription, fetchSubscriptionDetails] = useSubscriptionContext();
  const [isDisabled, disableRefreshButton] = useDisable(1);

  const onRefresh = () => {
    fetchSubscriptionDetails(auth.data.uid);

    disableRefreshButton();
  };

  const subscriptionText = () => {
    if (subscription.isLoading) {
      return "Loading...";
    }

    if (subscription.isErr || !subscription.data) {
      return "Error while fetching data";
    }

    if (
      subscription.data &&
      (!subscription.data.plan || !subscription.data.plan.type)
    ) {
      return "No subscription";
    }

    return subscription.data.plan.type;
  };

  return (
    <Box mt={3}>
      <Input
        type="text"
        value={subscriptionText()}
        label="Subscription"
        error={
          subscription.isLoading ||
          subscription.isErr ||
          (subscription.data && !subscription.data.plan)
        }
        InputProps={{
          readOnly: true,
        }}
      />
      <Box mt={3}>
        <Button clickEvent={onRefresh} text="Refresh" disabled={isDisabled} />
      </Box>
    </Box>
  );
};
