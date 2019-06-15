import { useState, useEffect } from "react";
import { globalStore } from "../../../GlobalStore/GlobalStore";

export const useGenericFetch = (fetchFunction, ...args) => {
  const defaultState = {
    data: null,
    isLoading: true,
    err: false
  };

  const [data, setData] = useState(defaultState);

  async function fetchData() {
    setData({
      ...data,
      isLoading: true
    });

    try {
      const fetchedData = await fetchFunction(...args);

      setData({
        ...defaultState,
        data: fetchedData,
        isLoading: false,
        err: false
      });
    } catch (e) {
      setData({
        ...defaultState,
        data: null,
        isLoading: false,
        err: true
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return [data, fetchData];
};

export const useStoreListener = storeKey => {
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

export const useDisable = milliseconds => {
  const [isDisabled, setIsDisabled] = useState(false);

  function disable() {
    setIsDisabled(previousIsDisabled => !previousIsDisabled);

    setTimeout(() => {
      setIsDisabled(previousIsDisabled => !previousIsDisabled);
    }, milliseconds);
  }

  return [isDisabled, disable];
};

export const useTimeoutWithFeedback = milliseconds => {
  const [showFeedback, setShowFeedback] = useState(false);

  let timeout;

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  function startTimeout() {
    setShowFeedback(true);

    timeout = setTimeout(() => {
      setShowFeedback(false);
    }, milliseconds);
  }

  return [showFeedback, startTimeout];
};
