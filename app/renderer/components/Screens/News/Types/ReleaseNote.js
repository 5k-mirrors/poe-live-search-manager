import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import { openExternalUrl } from "../../../../utils/ElectronUtils/ElectronUtils";
import * as javaScripUtils from "../../../../../utils/JavaScriptUtils/JavaScriptUtils";

export default ({ ...details }) => (
  <div>
    <h1>
      {javaScripUtils.isDefined(details.link) ? (
        /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
        <Link
          component="button"
          variant="h4"
          onClick={() => openExternalUrl(details.link)}
          size="large"
        >
          {details.title}
        </Link>
      ) : (
        details.title
      )}
    </h1>
    <ReactMarkdown source={details.description} />
    <Divider />
  </div>
);
