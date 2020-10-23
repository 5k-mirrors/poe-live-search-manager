import React from "react";
import { MTableEditField } from "material-table";
import * as regExes from "../../../../shared/resources/RegExes/RegExes";

const editableSearchUrl = ({ ...props }) => {
  const { value } = props;

  return (
    <MTableEditField
      error={!regExes.searchUrlLeagueAndIdMatcher.test(value)}
      {...props}
    />
  );
};

export default editableSearchUrl;
