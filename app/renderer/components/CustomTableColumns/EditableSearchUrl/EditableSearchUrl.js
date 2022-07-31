import React from "react";
import { MTableEditField } from "@material-table/core";
import * as regExes from "../../../../shared/resources/RegExes/RegExes";

const editableSearchUrl = ({ ...props }) => {
  const { value } = props;

  return (
    <MTableEditField error={!regExes.poeTradeUrl.test(value)} {...props} />
  );
};

export default editableSearchUrl;
