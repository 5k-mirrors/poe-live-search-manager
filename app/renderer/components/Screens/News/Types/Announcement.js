import React from "react";
import moment from "moment";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { openExternalUrl } from "../../../../utils/ElectronUtils/ElectronUtils";
import { Url } from "../../../../utils/ReactMarkdown/renderers";

const Announcement = ({ ...details }) => (
  <div>
    {details.link ? (
      <Link
        to={details.link}
        component="button"
        variant="h4"
        onClick={() => openExternalUrl(details.link)}
        size="large"
      >
        {details.title}
      </Link>
    ) : (
      <h3>{details.title}</h3>
    )}
    <Typography variant="body2" component="p">
      {moment(details.date).format("DD.MM.YYYY")}
    </Typography>
    <ReactMarkdown
      source={details.description}
      renderers={{
        link: props => <Url {...props} />,
      }}
      plugins={[breaks]}
    />
    <Divider />
  </div>
);

export default Announcement;
