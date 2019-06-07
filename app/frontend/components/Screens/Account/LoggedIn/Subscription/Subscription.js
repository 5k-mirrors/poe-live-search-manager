import React from "react";
import styled from "styled-components";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import baseApiUrl from "../../../../../resources/BaseApiUrl/BaseApiUrl";
import LoaderIcon from "../../../../UI/LoaderIcon/LoaderIcon";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import { refreshButton } from "./Subscription.style";

const StyledRefreshButton = styled.button`
  ${refreshButton}
`;

function getSubscriptionData(id) {
  const userApiUrl = `${baseApiUrl}/user/${id}`;

  return fetch(userApiUrl)
    .then(userSubscriptionDetails => userSubscriptionDetails.json())
    .then(parsedSubscriptionDetails => parsedSubscriptionDetails);
}

const subscription = ({ id }) => {
  const [subscriptionData, refreshData] = CustomHooks.useGenericFetch(
    getSubscriptionData,
    id
  );
  const [isDisabled, disableButton] = CustomHooks.useDisable(1);

  function onRefreshButtonClick() {
    refreshData();

    disableButton();
  }

  if (subscriptionData.isLoading) {
    return <LoaderIcon />;
  }

  if (subscriptionData.err) {
    return <p>An error occurred while querying subcription information.</p>;
  }

  return (
    <div>
      <DataDisplayer data={subscriptionData.data} />
      <StyledRefreshButton disabled={isDisabled} onClick={onRefreshButtonClick}>
        Refresh
      </StyledRefreshButton>
    </div>
  );
};

export default subscription;
