import React from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typograpghy from "@material-ui/core/Typography";
import NavigationBarItem from "./NavigationBarItem/NavigationBarItem";
import { routes } from "../../resources/Routes/Routes";
import { useNavigationBarStyles } from "./NavigationBar.style";

// What's the current version number?
// https://stackoverflow.com/a/36733261/9599137
import { version } from "../../../../package.json";

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
        <Typograpghy className={classes.verson} variant="subtitle2">
          {version}
        </Typograpghy>
      </Paper>
    </Container>
  );
};

export default navigationBar;
