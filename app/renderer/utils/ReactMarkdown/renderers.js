import React from "react";
import Link from "@mui/material/Link";
import { openExternalUrl } from "../ElectronUtils/ElectronUtils";

export const Url = ({ ...props }) => {
  const {
    href,
    children: [...children],
  } = props;

  return (
    <Link
      to={href}
      component="button"
      variant="subtitle1"
      onClick={() => openExternalUrl(href)}
    >
      {children[0].props.value}
    </Link>
  );
};
