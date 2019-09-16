import React from "react";
import SearchUrl from "../../components/CustomTableColumns/SearchUrl/SearchUrl";
import Connected from "../../components/CustomTableColumns/Connected/Connected";
import ResultLink from "../../components/CustomTableColumns/ResultLink/ResultLink";

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

export const tradeScreen = [
  { field: "id", hidden: true },
  {
    title: "Name",
    field: "name",
    render: props => {
      const { name, searchUrl } = props;

      return <ResultLink name={name} url={searchUrl} />;
    },
  },
  {
    title: "Price",
    field: "price",
  },
  {
    title: "Whisper",
    field: "whisperMessage",
  },
];
