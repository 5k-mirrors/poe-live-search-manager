import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import ButtonWithSuccessIcon from "../../../../UI/ButtonWithSuccessIcon/ButtonWithSuccessIcon";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";

const resultsListLimit = () => {
  const [limit, setLimit] = useState(
    globalStore.get(storeKeys.RESULTS_LIMIT, 100)
  );
  const [
    successIconIsVisible,
    displaySuccessIcon,
    hideSuccessIconAfterMsElapsed,
  ] = customHooks.useDisplay();

  function onSave() {
    const parsedLimit = Number(limit);

    globalStore.set(storeKeys.RESULTS_LIMIT, parsedLimit);

    const currentResults = globalStore.get(storeKeys.RESULTS, []);

    if (currentResults.length > parsedLimit) {
      const updatedResults = currentResults.slice(0, limit);

      globalStore.set(storeKeys.RESULTS, updatedResults);
    }

    displaySuccessIcon();

    hideSuccessIconAfterMsElapsed(2500);
  }

  return (
    <Box mt={2}>
      <Typography variant="subtitle1">Remember this many results</Typography>
      <Input
        type="number"
        onChange={e => setLimit(e.target.value)}
        value={limit}
        margin="normal"
      />
      <Box>
        <ButtonWithSuccessIcon
          text="Save"
          clickEvent={onSave}
          iconIsVisible={successIconIsVisible}
        />
      </Box>
    </Box>
  );
};

export default resultsListLimit;
