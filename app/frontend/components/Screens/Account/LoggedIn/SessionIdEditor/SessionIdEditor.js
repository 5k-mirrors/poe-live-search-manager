import React, { useState, useEffect, Fragment } from "react";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import InfoButton from "./InfoButton/InfoButton";
import Button from "../../../../UI/Button/Button";
import SuccessImage from "../../../../UI/SuccessImage/SuccessImage";
import Input from "../../../../UI/Input/Input";
import FlexContainer from "../../../../UI/FlexContainer/FlexContainer";

const sessionIdEditor = () => {
  const [poeSessionId, setPoeSessionId] = useState(
    globalStore.get(storeKeys.POE_SESSION_ID, "")
  );
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  let timer;

  useEffect(() => {
    return () => clearInterval(timer);
  }, []);

  function onSaveButtonClick() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);

    setShowSuccessIcon(true);

    timer = setTimeout(() => {
      setShowSuccessIcon(false);
    }, 2500);
  }

  return (
    <Fragment>
      <FlexContainer>
        <Input
          type="text"
          placeholder="PoE Session ID"
          onChange={e => setPoeSessionId(e.target.value)}
          value={poeSessionId}
        />
        <InfoButton />
      </FlexContainer>
      <FlexContainer>
        <Button clickEvent={onSaveButtonClick} text="Save" />
        {showSuccessIcon ? <SuccessImage /> : null}
      </FlexContainer>
    </Fragment>
  );
};

export default sessionIdEditor;
