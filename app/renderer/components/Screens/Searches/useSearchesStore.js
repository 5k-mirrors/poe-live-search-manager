import { useState, useEffect } from "react";

import { uniqueIdGenerator } from "../../../../shared/utils/UniqueIdGenerator/UniqueIdGenerator";
import * as regExes from "../../../../shared/resources/RegExes/RegExes";

const useSearchesStore = (name) => {
  const [searchesStore, setSearchesStore] = useState(JSON.parse(localStorage.getItem('searchState' + name) || '[]'));

  // Update localStorage when the store state changes.
  useEffect(() => {
    localStorage.setItem('searchState' + name, JSON.stringify(searchesStore))
  }, [searchesStore])

  const deleteSearch = searchDetails => {
    const newState = searchesStore.filter(search => search.id !== searchDetails.id);
    setSearchesStore(newState);

    return Promise.resolve();
  };

  const addNewSearch = searchDetails => {
    if (!regExes.poeTradeUrl.test(searchDetails.searchUrl)) {
      return Promise.reject(
        new Error(`Invalid search url: ${searchDetails.searchUrl}`)
      );
    }

    const searchDetailsWithUniqueId = {
      id: uniqueIdGenerator(),
      ...searchDetails,
    };

    setSearchesStore(oldSearchesStore => {
      const newState = [
        ...oldSearchesStore,
        {
          ...searchDetailsWithUniqueId,
          isConnected: false,
        },
      ];

      return newState;
    });

    return Promise.resolve();
  };

  const deleteAllSearches = () => {
    setSearchesStore([]);
    localStorage.removeItem('searchState' + name);
  };

  return {
    name,
    searchesStore,
    deleteSearch,
    addNewSearch,
    deleteAllSearches,
  };
};

export default useSearchesStore;
