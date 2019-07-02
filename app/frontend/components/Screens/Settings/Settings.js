import React from "react";
import Notifications from "./Notifications/Notifications";
import withLoggedOutRestriction from "../../withLoggedOutRedirection/withLoggedOutRedirection";

const settings = () => <Notifications />;

export default withLoggedOutRestriction(settings, "/account");
