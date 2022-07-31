import { useState, useEffect, useRef } from "react";

const useTimeout = (ms = 1000) => {
  const timeoutId = useRef();
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => () => clearTimeout(timeoutId.current), []);

  const timeout = () => {
    setIsTimeout(true);

    timeoutId.current = setTimeout(() => {
      setIsTimeout(false);
    }, ms);
  };

  return { isTimeout, timeout };
};

export default useTimeout;
