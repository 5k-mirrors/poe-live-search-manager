/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import { openExternalUrl } from "../../../../utils/ElectronUtils/ElectronUtils";

const Url = ({ ...props }) => {
  const {
    href,
    children: [...children],
  } = props;

  return (
    <Link
      component="button"
      variant="subtitle1"
      onClick={() => openExternalUrl(href)}
    >
      {children[0].props.value}
    </Link>
  );
};

export default ({ ...itemDetails }) => (
  <div>
    {itemDetails.link ? (
      <Link
        component="button"
        variant="h4"
        onClick={() => openExternalUrl(itemDetails.link)}
        size="large"
      >
        {itemDetails.title}
      </Link>
    ) : (
      itemDetails.title
    )}
    <Typography variant="body2" component="p">
      {moment(itemDetails.date).format("DD.MM.YYYY")}
    </Typography>
    <ReactMarkdown
      source={itemDetails.description}
      renderers={{
        link: props => <Url {...props} />,
      }}
      plugins={[breaks]}
    />
    <Divider />
  </div>
);
