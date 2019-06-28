import React from "react";
import { NavLink } from "react-router-dom";

const navLinkActiveStyle = {
  fontWeight: "bold"
};

const navigationBarItem = ({ displayName, routePath }) => (
  <NavLink
    style={{ color: "#000000" }}
    activeStyle={navLinkActiveStyle}
    to={routePath}
  >
    {displayName}
  </NavLink>
);

export default navigationBarItem;
