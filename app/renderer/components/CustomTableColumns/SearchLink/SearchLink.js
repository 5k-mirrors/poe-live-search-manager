import React from "react";
import Button from "../../UI/SimpleHtmlElements/Button/Button";
import * as electronUtils from "../../../utils/ElectronUtils/ElectronUtils";

const searchLink = ({ name, url, ...props }) => (
  <Button
    clickEvent={() => electronUtils.openExternalUrl(url)}
    text={name}
    size="small"
    variant="text"
    {...props}
  />
);

export default searchLink;
