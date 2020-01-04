import React from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavigationItems from "./NavigationItems/NavigationItems";
import RightSide from "./RightSide/RightSide";
import RateLimitFeedback from "./RateLimitFeedback/RateLimitFeedback";
import { useNavigationBarStyles } from "./NavigationBar.style";

export default () => {
  const classes = useNavigationBarStyles();

  return (
    <Container>
      <Paper className={classes.container}>
        <RateLimitFeedback />
        <NavigationItems />
        <RightSide />
      </Paper>
    </Container>
  );
};
