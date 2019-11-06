import React from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavigationItems from "./NavigationItems/NavigationItems";
import RightSide from "./RightSide/RightSide";
import RemainingRequestsDisplayer from "./RemainingRequestsDisplayer/RemainingRequestsDisplayer";
import { useNavigationBarStyles } from "./NavigationBar.style";

const navigationBar = () => {
  const classes = useNavigationBarStyles();

  return (
    <Container>
      <Paper className={classes.container}>
        <RemainingRequestsDisplayer />
        <NavigationItems />
        <RightSide />
      </Paper>
    </Container>
  );
};

export default navigationBar;
