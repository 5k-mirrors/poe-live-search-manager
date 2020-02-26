import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/SimpleHtmlElements/Button/Button";
import { useAuthContext } from "../../../../contexts";

export default () => {
  const { state: auth, signOut } = useAuthContext();

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        mb={3}
        justifyContent="space-between"
      >
        <Typography variant="h6" gutterBottom>
          {`Logged in as ${auth.data.displayName || auth.data.email}`}
        </Typography>
        <Button clickEvent={signOut} text="Sign out" />
      </Box>
      <SessionIdEditor />
      <SubscriptionDetails />
    </div>
  );
};
