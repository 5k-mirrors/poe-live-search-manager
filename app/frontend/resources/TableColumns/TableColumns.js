import React from "react";
import SearchUrl from "../../components/CustomTableColumns/SearchUrl/SearchUrl";
import Connected from "../../components/CustomTableColumns/Connected/Connected";

export const inputScreen = [
  { field: "id", hidden: true },
  { title: "Item name", field: "name" },
  {
    title: "Search URL",
    field: "searchUrl",
    editComponent: props => <SearchUrl {...props} />
  },
  {
    title: "Connected",
    field: "isConnected",
    editable: "never",
    render: props => <Connected {...props} />
  }
];

export const tradeScreen = [
  { title: "Name", field: "itemName" },
  { title: "Price", field: "itemPrice" }
];
