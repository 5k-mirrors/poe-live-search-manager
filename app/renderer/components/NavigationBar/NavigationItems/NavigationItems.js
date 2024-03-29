import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { NavLink } from "react-router-dom";
import { routes } from "../../../resources/Routes/Routes";

const navigationItems = () => (
  <Breadcrumbs separator="">
    {routes.map(route => (
      <NavLink
        key={route.displayName}
        style={{ color: "#000000" }}
        activeStyle={{ fontWeight: "bold" }}
        to={route.path}
      >
        {route.displayName}
      </NavLink>
    ))}
  </Breadcrumbs>
);

export default navigationItems;
