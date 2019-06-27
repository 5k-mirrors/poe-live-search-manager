/* eslint-disable camelcase */
import React from "react";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useDataDisplayerStyles } from "./DataDisplayer.style";

const ListPrimaryText = ({ text }) => {
  const classes = useDataDisplayerStyles();

  return <Typography className={classes.primaryText}>{text}</Typography>;
};

const ListSecondaryText = ({ text }) => {
  const classes = useDataDisplayerStyles();

  return <span className={classes.secondaryText}>{text}</span>;
};

const dataDisplayer = ({ subscriptionData }) => {
  const classes = useDataDisplayerStyles();

  const { tier, period, active_until } = subscriptionData.active_subscription;

  return (
    <List component="nav" aria-label="Main mailbox folders">
      <ListItem className={classes.listItem}>
        <ListItemText
          primary={<ListPrimaryText text="Tier" />}
          secondary={<ListSecondaryText text={tier} />}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <ListItemText
          primary={<ListPrimaryText text="Period" />}
          secondary={<ListSecondaryText text={period} />}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <ListItemText
          primary={<ListPrimaryText text="Expires at" />}
          secondary={<ListSecondaryText text={active_until} />}
        />
      </ListItem>
    </List>
  );
};

export default dataDisplayer;
