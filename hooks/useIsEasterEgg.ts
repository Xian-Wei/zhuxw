import { useEffect, useState } from "react";

const useIsEasterEgg = () => {
  let sequence = "";
  const [isDev, setIsDev] = useState<boolean>(false);

  const activateDevMode = () => {
    setIsDev(true);
  };

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
      sequence += e.key;

      if (sequence.includes("caca")) {
        activateDevMode();
      }
    }
  }

  function handleDoubleTouch(e: TouchEvent) {
    if (e.touches.length > 1) {
      activateDevMode();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleDoubleTouch);

    if (process.env.NODE_ENV == "development") {
      activateDevMode();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleDoubleTouch);
    };
  }, []);

  return { isDev };
};

export default useIsEasterEgg;
