import { useState, useEffect } from "react";
import { globalStore } from "../../../GlobalStore/GlobalStore";

const useStoreListener = storeKey => {
  const [value, setValue] = useState(globalStore.get(storeKey));

  useEffect(() => {
    const removeListener = globalStore.onDidChange(storeKey, updatedData => {
      setValue(updatedData);
    });

    return () => {
      removeListener();
    };
  }, []);

  return [value, setValue];
};

export default useStoreListener;
