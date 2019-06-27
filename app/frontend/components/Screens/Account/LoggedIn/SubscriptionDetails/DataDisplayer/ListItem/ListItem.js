import React from "react";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useListItemStyles } from "./ListItem.style";

const ListPrimaryText = ({ text }) => {
  const classes = useListItemStyles();

  return <Typography className={classes.primaryText}>{text}</Typography>;
};

const ListSecondaryText = ({ text }) => {
  const classes = useListItemStyles();

  return <span className={classes.secondaryText}>{text}</span>;
};

const listItem = ({ primaryText, secondaryText }) => {
  const classes = useListItemStyles();

  return (
    <ListItem className={classes.listItem}>
      <ListItemText
        primary={<ListPrimaryText text={primaryText} />}
        secondary={<ListSecondaryText text={secondaryText} />}
      />
    </ListItem>
  );
};

export default listItem;
