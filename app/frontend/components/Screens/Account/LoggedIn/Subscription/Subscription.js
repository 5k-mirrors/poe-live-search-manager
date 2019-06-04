import React from "react";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import * as BaseUrls from "../../../../../resources/BaseUrls/BaseUrls";
import LoaderIcon from "../../../../UI/LoaderIcon/LoaderIcon";
import Button from "../../../../UI/Button/Button";
import DataDisplayer from "./DataDisplayer/DataDisplayer";

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
    return <p>Error while quering subscription information.</p>;
  }

  return (
    <div>
      <DataDisplayer data={subscriptionData.data} />
      <Button text="Refresh" clickEvent={refreshData} />
    </div>
  );
};

export default subscription;
