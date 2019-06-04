import React from "react";

const dataDisplayer = ({ data }) => (
  <div>
    <h3>Subscription information</h3>
    <div>
      <p>{data.active_subscription.tier}</p>
      <p>{data.active_subscription.period}</p>
      <p>{data.active_subscription.active_until}</p>
    </div>
  </div>
);

export default dataDisplayer;
