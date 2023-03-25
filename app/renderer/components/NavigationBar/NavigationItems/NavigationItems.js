import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from '@mui/material/Link';
import { NavLink } from "react-router-dom";
import { routes } from "../../../resources/Routes/Routes";

const navigationItems = () => (
  <Breadcrumbs separator="">
    {routes.map(route => (
      <Link
        component={NavLink}
        key={route.displayName}
        style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
        to={route.path}
      >
        {route.displayName}
      </Link>
    ))}
  </Breadcrumbs>
);

export default navigationItems;
