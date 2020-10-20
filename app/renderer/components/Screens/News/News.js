import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import fetch from "node-fetch";

import { Announcement, ReleaseNote } from "./Types";
import { useNewsStyles } from "./News.style";
import Announcements from "../../../resources/Announcements/Announcements";
import {
  devErrorLog,
  safeJsonResponse,
} from "../../../../utils/JavaScriptUtils/JavaScriptUtils";

export default () => {
  const classes = useNewsStyles();
  const [githubReleaseNotes, setGithubReleaseNotes] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/5k-mirrors/poe-live-search-manager/releases"
    )
      .then(data => safeJsonResponse(data))
      .then(parsedData => setGithubReleaseNotes(parsedData))
      .catch(error => devErrorLog(error));
  }, []);

  return (
    <Paper className={classes.root}>
      {Announcements.map(announcement => {
        return (
          <Announcement
            key={announcement.title + announcement.date}
            {...announcement}
          />
        );
      })}
      {githubReleaseNotes.map(githubReleaseNote => {
        return (
          <ReleaseNote
            key={githubReleaseNote.name + githubReleaseNote.published_at}
            {...githubReleaseNote}
          />
        );
      })}
    </Paper>
  );
};
