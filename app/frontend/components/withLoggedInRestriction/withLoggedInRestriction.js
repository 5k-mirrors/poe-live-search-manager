import React from "react";
import { Redirect } from "react-router-dom";
import { globalStore } from "../../../GlobalStore/GlobalStore";

const withLoggedInRestriction = WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.isLoggedIn = globalStore.get("isLoggedIn", false);
    }

    render() {
      if (!this.isLoggedIn) {
        return <Redirect to="/account" />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withLoggedInRestriction;
