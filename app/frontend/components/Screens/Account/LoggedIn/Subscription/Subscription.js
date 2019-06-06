import React from "react";
import styled from "styled-components";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import * as BaseUrls from "../../../../../resources/BaseUrls/BaseUrls";
import LoaderIcon from "../../../../UI/LoaderIcon/LoaderIcon";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import { refreshButton } from "./Subscription.style";

const StyledRefreshButton = styled.button`
  ${refreshButton}
`;

function getSubscriptionData(id) {
  const userAPIUrl = BaseUrls.userAPI + id;

  return fetch(userAPIUrl)
    .then(userSubscriptionDetails => userSubscriptionDetails.json())
    .then(parsedSubscriptionDetails => parsedSubscriptionDetails);
}

const subscription = ({ id }) => {
  const [subscriptionData, refreshData] = CustomHooks.useGenericFetch(
    getSubscriptionData,
    id
  );

  if (subscriptionData.isLoading) {
    return <LoaderIcon />;
  }

  if (subscriptionData.err) {
    return <p>An error occurred while querying subcription information.</p>;
  }

  return (
    <div>
      <DataDisplayer data={subscriptionData.data} />
      <StyledRefreshButton onClick={refreshData}>Refresh</StyledRefreshButton>
    </div>
  );
};

export default subscription;
