import { useState, useEffect } from "react";

export const useGenericFetch = (fetchFunction, ...args) => {
  const defaultState = {
    data: null,
    isLoading: true,
    err: false
  };

  const [data, setData] = useState(defaultState);

  async function fetchData() {
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
