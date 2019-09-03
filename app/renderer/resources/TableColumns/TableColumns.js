import React from "react";
import SearchUrl from "../../components/CustomTableColumns/SearchUrl/SearchUrl";
import Connected from "../../components/CustomTableColumns/Connected/Connected";

export const inputScreen = [
  { field: "id", hidden: true },
  {
    title: "Connected",
    field: "isConnected",
    editable: "never",
    render: props => <Connected {...props} />,
  },
  { title: "Item name", field: "name" },
  {
    title: "Search URL",
    field: "searchUrl",
    editComponent: props => <SearchUrl {...props} />,
  },
];
