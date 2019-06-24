import React from "react";
import { MTableEditField } from "material-table";
import * as regExes from "../../../resources/RegExes/RegExes";

export const inputScreen = [
  { field: "id", hidden: true },
  { title: "Item name", field: "name" },
  {
    title: "Search URL",
    field: "searchUrl",
    editComponent: props => {
      const { value } = props;

      return (
        <MTableEditField
          error={!regExes.searchUrlLeagueAndIdMatcher.test(value)}
          {...props}
        />
      );
    }
  }
];

export const tradeScreen = [
  { title: "Name", field: "itemName" },
  { title: "Price", field: "itemPrice" }
];
