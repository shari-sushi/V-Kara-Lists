import { useState, useEffect } from "react";

export const useHasWindow = () => {
  const [hasWindow, setHasWindow] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return hasWindow;
};
