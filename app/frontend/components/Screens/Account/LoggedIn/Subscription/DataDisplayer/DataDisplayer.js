import React from "react";

// TODO: Why JSON.stringify is required here?
const dataDisplayer = ({ data }) => (
  <div>
    <h3>Subscription information</h3>
    <div>
      <p>{JSON.stringify(data.paying)}</p>
      <p>{data.active_subscription.tier}</p>
      <p>{data.active_subscription.period}</p>
      <p>{data.active_subscription.active_until}</p>
    </div>
  </div>
);

export default dataDisplayer;
