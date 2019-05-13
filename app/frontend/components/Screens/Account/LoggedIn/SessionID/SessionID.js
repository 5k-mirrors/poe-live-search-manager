import React, { useState } from "react";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";

// TODO: rename the component to something else.
const sessionID = () => {
  const [poeSessionId, setPoeSessionId] = useState("");

  function onPoeSessionIdChange(e) {
    setPoeSessionId(e.target.value);
  }

  function onSaveButtonClick() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <input
        type="text"
        placeholder="PoE Session ID"
        onChange={e => onPoeSessionIdChange(e)}
        value={poeSessionId}
      />
      <button type="button" onClick={onSaveButtonClick}>
        Save
      </button>
    </div>
  );
};

export default sessionID;
