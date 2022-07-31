import React, { useState } from "react";
import Box from "@mui/material/Box";
import Input from "../../../UI/SimpleHtmlElements/Input/Input";
import ButtonWithSuccessIcon from "../../../UI/ButtonWithSuccessIcon/ButtonWithSuccessIcon";
import GlobalStore from "../../../../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../shared/resources/StoreKeys/StoreKeys";

const ResultsListLimit = () => {
  const globalStore = GlobalStore.getInstance();

  const [limit, setLimit] = useState(
    globalStore.get(storeKeys.RESULTS_LIMIT, 100)
  );

  function onSave() {
    const parsedLimit = Number(limit);

    globalStore.set(storeKeys.RESULTS_LIMIT, parsedLimit);

    const currentResults = globalStore.get(storeKeys.RESULTS, []);

    if (currentResults.length > parsedLimit) {
      const updatedResults = currentResults.slice(0, limit);

      globalStore.set(storeKeys.RESULTS, updatedResults);
    }

    return Promise.resolve();
  }

  return (
    <>
      <Input
        type="number"
        onChange={e => setLimit(e.target.value)}
        value={limit}
        margin="normal"
      />
      <Box>
        <ButtonWithSuccessIcon text="Save" clickEventHandler={onSave} />
      </Box>
    </>
  );
};

export default ResultsListLimit;
