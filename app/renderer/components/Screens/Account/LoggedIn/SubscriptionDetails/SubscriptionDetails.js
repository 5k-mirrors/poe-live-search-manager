import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import GenericFetchDataDisplayer from "../../../../GenericFetchDataDisplayer/GenericFetchDataDisplayer";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import subscription from "../../../../../../Subscription/Subscription";
import * as webSocketActions from "../../../../../../main/web-sockets/actions";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import * as firebaseUtils from "../../../../../utils/FirebaseUtils/FirebaseUtils";

const subscriptionDetails = () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  const [fetchedData, refreshFetchedData] = customHooks.useGenericFetch(
    subscription.query,
    firebaseContext.currentUser.uid
  );
  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

  function onRefreshButtonClick() {
    refreshFetchedData();

    webSocketActions.updateConnections();

    disableRefreshButton();
  }

  return (
    <Box mt={3}>
      <Typography variant="h6">Subscription information</Typography>
      <GenericFetchDataDisplayer fetchedData={fetchedData}>
        <DataDisplayer subscriptionData={fetchedData.data} />
      </GenericFetchDataDisplayer>
      <Button
        clickEvent={onRefreshButtonClick}
        text="Refresh"
        disabled={isDisabled}
      />
    </Box>
  );
};

export default subscriptionDetails;
