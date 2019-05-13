import React from "react";
import { remote } from "electron";
import { Redirect } from "react-router-dom";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";

const withLoggedInRedirection = (WrappedComponent, redirectTo) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      // this.isLoggedIn = globalStore.get("isLoggedIn", false);
      this.isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);
    }

    render() {
      if (!this.isLoggedIn) {
        remote.dialog.showErrorBox(
          "Authentication is required",
          "You must be logged in."
        );

        return <Redirect to={redirectTo} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withLoggedInRedirection;
