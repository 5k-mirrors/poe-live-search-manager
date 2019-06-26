import React from "react";
import { MTableEditField } from "material-table";
import * as regExes from "../../../../resources/RegExes/RegExes";

const searchUrl = ({ ...props }) => {
  const { value } = props;

  return (
    <MTableEditField
      error={!regExes.searchUrlLeagueAndIdMatcher.test(value)}
      {...props}
    />
  );
};

export default searchUrl;
