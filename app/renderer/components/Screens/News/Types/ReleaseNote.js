import React from "react";
import moment from "moment";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { openExternalUrl } from "../../../../utils/ElectronUtils/ElectronUtils";
import { Url } from "../../../../utils/ReactMarkdown/renderers";

const ReleaseNote = ({ ...details }) => (
  <div>
    <Link
      component="button"
      to={details.html_url}
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
