/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Link from "@material-ui/core/Link";
import { openExternalUrl } from "../ElectronUtils/ElectronUtils";

export const Url = ({ ...props }) => {
  const {
    href,
    children: [...children],
  } = props;

  return (
    <Link
      component="button"
      variant="subtitle1"
      onClick={() => openExternalUrl(href)}
    >
      {children[0].props.value}
    </Link>
  );
};
