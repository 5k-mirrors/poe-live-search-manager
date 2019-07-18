import React from "react";
import { Redirect } from "react-router-dom";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";

const withLoggedOutRedirection = (WrappedComponent, redirectTo) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);
    }

    render() {
      if (!this.isLoggedIn) {
        return <Redirect to={redirectTo} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withLoggedOutRedirection;
