import React from "react";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigationBarItem from "./NavigationBarItem/NavigationBarItem";
import { routes } from "../../resources/Routes/Routes";
import { useNavigationBarStyles } from "./NavigationBar.style";

const navigationBar = () => {
  const classes = useNavigationBarStyles();

  return (
    <Paper className={classes.container}>
      <Breadcrumbs aria-label="Breadcrumb">
        {routes.map(route => (
          <NavigationBarItem
            key={route.displayName}
            displayName={route.displayName}
            routePath={route.routePath}
          />
        ))}
      </Breadcrumbs>
    </Paper>
  );
};

export default navigationBar;
