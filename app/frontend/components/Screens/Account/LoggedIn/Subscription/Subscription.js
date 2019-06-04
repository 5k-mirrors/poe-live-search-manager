import React from "react";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import * as BaseUrls from "../../../../../resources/BaseUrls/BaseUrls";
import LoaderIcon from "../../../../UI/LoaderIcon/LoaderIcon";
import DataDisplayer from "./DataDisplayer/DataDisplayer";

function getSubscriptionData(id) {
  const fetchUrl = BaseUrls.userAPI + id;

  return fetch(fetchUrl)
    .then(userSubscriptionDetails => userSubscriptionDetails.json())
    .then(parsedSubscriptionDetails => parsedSubscriptionDetails);
}

const subscription = ({ id }) => {
  const subscriptionData = CustomHooks.useGenericFetch(getSubscriptionData, id);

  if (subscriptionData.isLoading) {
    return <LoaderIcon />;
  }

  if (subscriptionData.err) {
    return <p>Error while quering subscription information.</p>;
  }

  return <DataDisplayer data={subscriptionData.data} />;
};

export default subscription;
