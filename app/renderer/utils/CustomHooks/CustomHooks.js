import { useState, useEffect, useRef } from "react";

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
