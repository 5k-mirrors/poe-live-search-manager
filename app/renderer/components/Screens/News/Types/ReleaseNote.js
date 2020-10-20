/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import { openExternalUrl } from "../../../../utils/ElectronUtils/ElectronUtils";
import { Url } from "../../../../utils/ReactMarkdown/renderers";

const ReleaseNote = ({ ...details }) => (
  <div>
    <Link
      component="button"
      variant="h4"
      onClick={() => openExternalUrl(details.html_url)}
      size="large"
    >
      {details.name}
    </Link>
    <Typography variant="body2" component="p">
      {moment(details.published_at).format("DD.MM.YYYY")}
    </Typography>
    <ReactMarkdown
      source={details.body}
      renderers={{
        link: props => <Url {...props} />,
      }}
      plugins={[breaks]}
    />
    <Divider />
  </div>
);

export default ReleaseNote;
