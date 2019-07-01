import React from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigationBarItem from "./NavigationBarItem/NavigationBarItem";
import VersionDisplayer from "./VersionDisplayer/VersionDisplayer";
import { routes } from "../../resources/Routes/Routes";
import { useNavigationBarStyles } from "./NavigationBar.style";

const navigationBar = () => {
  const classes = useNavigationBarStyles();

  return (
    <Container>
      <Paper className={classes.container}>
        <Breadcrumbs separator="" aria-label="Breadcrumb">
          {routes.map(route => (
            <NavigationBarItem
              style={{ justifyContent: "center" }}
              key={route.displayName}
              displayName={route.displayName}
              routePath={route.routePath}
            />
          ))}
        </Breadcrumbs>
        <VersionDisplayer />
      </Paper>
    </Container>
  );
};

export default navigationBar;
