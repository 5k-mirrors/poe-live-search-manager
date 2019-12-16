import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/SimpleHtmlElements/Button/Button";
import getFirebaseApp from "../../../../utils/GetFirebaseApp/GetFirebaseApp";
import { useAuthDataContext } from "../../../../contexts";

const loggedIn = () => {
  const authData = useAuthDataContext();

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        mb={3}
        justifyContent="space-between"
      >
        <Typography variant="h6" gutterBottom>
          {`Logged in as ${authData.displayName || authData.email}`}
        </Typography>
        <Button
          clickEvent={() =>
            getFirebaseApp()
              .auth()
              .signOut()
          }
          text="Sign out"
        />
      </Box>
      <SessionIdEditor />
      <SubscriptionDetails />
    </div>
  );
};

export default loggedIn;
