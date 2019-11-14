import React from "react";
import Paper from "@material-ui/core/Paper";
import { ReleaseNote, Unknown } from "./Types";
import { newsFeedItems, newsFeedItemTypes } from "../../../resources/NewsFeed";

export default () => (
  <Paper style={{ overflow: "auto", height: "600px", padding: 20 }}>
    {newsFeedItems.map(item => {
      if (item.type === newsFeedItemTypes.RELEASE_NOTE) {
        return <ReleaseNote {...item} />;
      }

      return <Unknown />;
    })}
  </Paper>
);
