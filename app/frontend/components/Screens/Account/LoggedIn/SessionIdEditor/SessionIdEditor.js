import React, { useState, useEffect, Fragment } from "react";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import InfoButton from "./InfoButton/InfoButton";
import Input from "../../../../UI/Input/Input";
import FlexContainer from "../../../../UI/FlexContainer/FlexContainer";
import ButtonWithSuccessIcon from "../../../../UI/ButtonWithSuccessIcon/ButtonWithSuccessIcon";

const sessionIdEditor = () => {
  const [poeSessionId, setPoeSessionId] = useState(
    globalStore.get(storeKeys.POE_SESSION_ID, "")
  );
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  let timer;

  useEffect(() => {
    return () => clearInterval(timer);
  }, []);

  function onSave() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);

    setShowSuccessIcon(true);

    timer = setTimeout(() => {
      setShowSuccessIcon(false);
    }, 2500);
  }

  return (
    <Fragment>
      <h3>PoE session ID</h3>
      <FlexContainer>
        <Input
          type="text"
          onChange={e => setPoeSessionId(e.target.value)}
          value={poeSessionId}
        />
        <InfoButton />
      </FlexContainer>
      <ButtonWithSuccessIcon
        text="Save"
        clickEvent={onSave}
        iconIsVisible={showSuccessIcon}
      />
    </Fragment>
  );
};

export default sessionIdEditor;
