import React from "react";
import Paper from "@material-ui/core/Paper";
import { ReleaseNote, Unknown } from "./Types";
import { useNewsStyles } from "./News.style";
import { newsFeedItems, newsFeedItemTypes } from "../../../resources/NewsFeed";

export default () => {
  const classes = useNewsStyles();

  return (
    <Paper className={classes.root}>
      {newsFeedItems.map(itemDetails => {
        switch (itemDetails.type) {
          case newsFeedItemTypes.RELEASE_NOTE:
            return <ReleaseNote {...itemDetails} />;
          default:
            return <Unknown />;
        }
      })}
    </Paper>
  );
};
