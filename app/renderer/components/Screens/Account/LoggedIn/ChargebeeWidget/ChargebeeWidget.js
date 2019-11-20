import React from "react";
import { remote } from "electron";
import { useFirebaseContext } from "../../../../../utils/FirebaseUtils/FirebaseUtils";
import { openExternalUrl } from "../../../../../utils/ElectronUtils/ElectronUtils";
import { ssoPortal as ssoPortalMessageBoxOptions } from "../../../../../resources/MessageBoxOptions/MessageBoxOptions";
import chargebeeIcon from "../../../../../resources/assets/PNG/chargebee.png";

export default () => {
  const firebaseContext = useFirebaseContext();

  const requestAccessUrl = userId =>
    fetch(
      `${process.env.FIREBASE_API_URL}/chargebee/portal-session/create/${userId}`
    )
      .then(response => response.json())
      .then(parsedResponse => {
        const clickedButtonIndex = remote.dialog.showMessageBox({
          ...ssoPortalMessageBoxOptions,
        });

        const openSsoPortal = clickedButtonIndex === 0;

        if (openSsoPortal) {
          openExternalUrl(parsedResponse.access_url);
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(`PORTAL SESSION REQUEST ERROR - ${err}`);
      });

  return (
    <button
      type="button"
      style={{
        display: "block",
        background: "none",
        outline: "none",
        border: "none",
        cursor: "pointer",
      }}
      onClick={() => requestAccessUrl(firebaseContext.currentUser.uid)}
    >
      <img src={chargebeeIcon} style={{ maxWidth: "50px" }} alt="Chargebee" />
    </button>
  );
};
