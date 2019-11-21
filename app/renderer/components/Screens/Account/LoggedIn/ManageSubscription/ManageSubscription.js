import React, { useCallback } from "react";
import Box from "@material-ui/core/Box";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import { useFirebaseContext } from "../../../../../utils/FirebaseUtils/FirebaseUtils";
import { openExternalUrl } from "../../../../../utils/ElectronUtils/ElectronUtils";

export default () => {
  const firebaseContext = useFirebaseContext();

  const openPortal = useCallback(() => {
    return fetch(
      `${process.env.FIREBASE_API_URL}/chargebee/portal-session/create/${firebaseContext.currentUser.uid}`
    )
      .then(response => response.json())
      .then(parsedResponse => {
        openExternalUrl(parsedResponse.access_url);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(`PORTAL SESSION REQUEST ERROR - ${err}`);
      });
  }, [firebaseContext.currentUser.uid]);

  return (
    <Box mt={3}>
      <Button clickEvent={() => openPortal()} text="Manage subscription" />
    </Box>
  );
};
