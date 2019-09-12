import { useState, useEffect, useRef } from "react";
import { globalStore } from "../../../GlobalStore/GlobalStore";

export const useGenericFetch = (fetchFunction, ...args) => {
  const defaultState = {
    data: null,
    isLoading: true,
    err: false,
  };

  const [data, setData] = useState(defaultState);
  const isMounted = useRef(true);

  async function fetchData() {
    setData({
      ...data,
      isLoading: true,
    });

    try {
      const fetchedData = await fetchFunction(...args);

      if (isMounted.current) {
        setData({
          ...defaultState,
          data: fetchedData,
          isLoading: false,
          err: false,
        });
      }
    } catch (e) {
      if (isMounted.current) {
        setData({
          ...defaultState,
          data: null,
          isLoading: false,
          err: true,
        });
      }
    }
  }

  useEffect(() => {
    fetchData();

    return () => {
      isMounted.current = false;
    };
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
  }, [storeKey]);

  return [value, setValue];
};

export const useDisable = seconds => {
  const timeoutId = useRef();
  const [isDisabled, setIsDisabled] = useState(false);

  function disable() {
    setIsDisabled(previousIsDisabled => !previousIsDisabled);

    const oneSecondInMilliseconds = 1000;

    timeoutId.current = setTimeout(() => {
      setIsDisabled(previousIsDisabled => !previousIsDisabled);
    }, seconds * oneSecondInMilliseconds);
  }

  useEffect(() => () => clearTimeout(timeoutId.current), []);

  return [isDisabled, disable];
};

export const useDisplay = () => {
  const [elementIsVisible, setShowElement] = useState(false);

  const timeout = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, [timeout]);

  const displayElement = () => setShowElement(true);

  const hideElementAfterMsElapsed = milliseconds => {
    timeout.current = setTimeout(() => {
      setShowElement(false);
    }, milliseconds);
  };

  return [elementIsVisible, displayElement, hideElementAfterMsElapsed];
};
