import React, { useState } from "react";
import Switch from "@mui/material/Switch";

const ToggleButton = ({ defaultState, changed }) => {
  const [toggleState, setToggleState] = useState(defaultState);

  function handleToggleChange(updatedToggleState) {
    setToggleState(updatedToggleState);

    changed(updatedToggleState);
  }

  return (
    <Switch
      checked={toggleState}
      onChange={e => handleToggleChange(e.target.checked)}
    />
  );
};

export default ToggleButton;
