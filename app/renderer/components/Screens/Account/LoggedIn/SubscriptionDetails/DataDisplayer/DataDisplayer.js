/* eslint-disable camelcase */
import React from "react";
import List from "@material-ui/core/List";
import ListItem from "./ListItem/ListItem";

const dataDisplayer = ({ subscriptionData }) => {
  const { tier, period, active_until } = subscriptionData.active_subscription;

  return (
    <List component="nav" aria-label="Main mailbox folders">
      <ListItem primaryText="Tier" secondaryText={tier} />
      <ListItem primaryText="Period" secondaryText={period} />
      <ListItem primaryText="Expires at" secondaryText={active_until} />
    </List>
  );
};

export default dataDisplayer;
