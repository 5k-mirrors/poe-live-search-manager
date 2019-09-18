import React from "react";
import EditableSearchUrl from "../../components/CustomTableColumns/EditableSearchUrl/EditableSearchUrl";
import Connected from "../../components/CustomTableColumns/Connected/Connected";
import SearchLink from "../../components/CustomTableColumns/SearchLink/SearchLink";

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

      return (
        <SearchLink
          name={searchUrl}
          url={searchUrl}
          style={{ textTransform: "none" }}
        />
      );
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

      return <SearchLink name={name} url={searchUrl} />;
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
