import React from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigationBarItem from "./NavigationBarItem/NavigationBarItem";
import { routes } from "../../resources/Routes/Routes";
import { useNavigationBarStyles } from "./NavigationBar.style";

const navigationBar = () => {
  const classes = useNavigationBarStyles();

  return (
    <Container maxWidth="sm">
      <Paper className={classes.container}>
        <Breadcrumbs
          className={classes.test}
          separator=""
          aria-label="Breadcrumb"
        >
          {routes.map(route => (
            <NavigationBarItem
              style={{ justifyContent: "center" }}
              key={route.displayName}
              displayName={route.displayName}
              routePath={route.routePath}
            />
          ))}
        </Breadcrumbs>
      </Paper>
    </Container>
  );
};

export default navigationBar;
