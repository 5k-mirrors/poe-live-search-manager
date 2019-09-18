import React from "react";
import EditableSearchUrl from "../../components/CustomTableColumns/EditableSearchUrl/EditableSearchUrl";
import Connected from "../../components/CustomTableColumns/Connected/Connected";
import SearchUrlLink from "../../components/CustomTableColumns/SearchUrlLink/SearchUrlLink";

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
    editComponent: props => <EditableSearchUrl {...props} />,
    render: props => {
      const { searchUrl } = props;

      return <SearchUrlLink name={searchUrl} url={searchUrl} />;
    },
  },
];

export const tradeScreen = [
  { field: "id", hidden: true },
  {
    title: "Name",
    field: "name",
    render: props => {
      const { name, searchUrl } = props;

      return <SearchUrlLink name={name} url={searchUrl} />;
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
