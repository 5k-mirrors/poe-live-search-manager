import React, { useState } from "react";
import Switch from "@material-ui/core/Switch";
import { useToggleButtonStyles } from "./ToggleButton.style";

export default ({ defaultState, changed }) => {
  const classes = useToggleButtonStyles();

  const [toggleState, setToggleState] = useState(defaultState);

  function handleToggleChange(updatedToggleState) {
    setToggleState(updatedToggleState);

    changed(updatedToggleState);
  }

  return (
    <Switch
      checked={toggleState}
      onChange={e => handleToggleChange(e.target.checked)}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
    />
  );
};
