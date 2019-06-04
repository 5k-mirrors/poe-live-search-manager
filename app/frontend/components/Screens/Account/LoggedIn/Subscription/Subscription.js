import React from "react";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import * as BaseUrls from "../../../../../resources/BaseUrls/BaseUrls";
import LoaderIcon from "../../../../UI/LoaderIcon/LoaderIcon";
import DataDisplayer from "./DataDisplayer/DataDisplayer";

// TODO: this might not be necessary, let's think about this.
/* function getUserAPIUrl(id) {
  return BaseUrls.userAPI + id;
} */

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
      <button type="button" onClick={refreshData}>
        Refresh
      </button>
    </div>
  );
};

export default subscription;
