import React from "react";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import * as BaseUrls from "../../../../../resources/BaseUrls/BaseUrls";
import LoaderIcon from "../../../../UI/LoaderIcon/LoaderIcon";

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

  return (
    <div>
      <h3>Subscription information</h3>
      <div>
        <p>{subscriptionDetails.data.paying}</p>
        <p>{subscriptionDetails.data.active_subscription.tier}</p>
        <p>{subscriptionDetails.data.active_subscription.period}</p>
        <p>{subscriptionDetails.data.active_subscription.active_until}</p>
      </div>
    </div>
  );
};

export default subscription;
