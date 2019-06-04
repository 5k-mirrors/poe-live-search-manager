import React from "react";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import * as BaseUrls from "../../../../../resources/BaseUrls/BaseUrls";
import LoaderIcon from "../../../../UI/LoaderIcon/LoaderIcon";
import DataDisplayer from "./DataDisplayer/DataDisplayer";

function getSubscriptionInformation(id) {
  const fetchUrl = BaseUrls.userAPI + id;

  return fetch(fetchUrl)
    .then(userSubscriptionDetails => userSubscriptionDetails.json())
    .then(parsedSubscriptionDetails => parsedSubscriptionDetails);
}

const subscription = ({ id }) => {
  const subscriptionDetails = CustomHooks.useGenericFetch(
    getSubscriptionInformation,
    id
  );

  if (subscriptionDetails.isLoading) {
    return <LoaderIcon />;
  }

  if (subscriptionDetails.err) {
    return <p>Error while quering subscription information.</p>;
  }

  return <DataDisplayer data={subscriptionDetails.data} />;
};

export default subscription;
