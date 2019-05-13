import React, { useState } from "react";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
// import Help from "../../../../../resources/assets/help.png";

// TODO: rename the component to something else.
const sessionID = () => {
  const [poeSessionId, setPoeSessionId] = useState("");

  function onPoeSessionIdChange(e) {
    setPoeSessionId(e.target.value);
  }

  function onSaveButtonClick() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);
  }

  // TODO: How to open link in the default browser?
  // https://stackoverflow.com/questions/31749625/make-a-link-from-electron-open-in-browser
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "5px"
        }}
      >
        <input
          type="text"
          placeholder="PoE Session ID"
          onChange={e => onPoeSessionIdChange(e)}
          value={poeSessionId}
          style={{
            padding: "5px 8px"
          }}
        />
      </div>
      <button
        style={{
          display: "block",
          padding: "5px 8px"
        }}
        type="button"
        onClick={onSaveButtonClick}
      >
        Save
      </button>
    </React.Fragment>
  );
};

export default sessionID;
