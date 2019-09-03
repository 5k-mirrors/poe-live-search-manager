import React from "react";
import Done from "@material-ui/icons/Done";
import Clear from "@material-ui/icons/Clear";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useDataDisplayerStyles } from "./DataDisplayer.style";

const dataDisplayer = ({ subscriptionData }) => {
  const classes = useDataDisplayerStyles();

  return (
    <List component="nav" aria-label="main mailbox folders">
      <ListItem>
        <ListItemIcon>
          {subscriptionData.paying ? (
            <Done className={classes.icon} />
          ) : (
            <Clear className={classes.icon} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            subscriptionData.paying
              ? `Active subscription ${
                  subscriptionData.type ? `: ${subscriptionData.type}` : ""
                }`
              : "Inactive subscription"
          }
        />
      </ListItem>
    </List>
  );
};

export default dataDisplayer;
