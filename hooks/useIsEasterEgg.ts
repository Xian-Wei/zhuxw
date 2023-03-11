import { useEffect, useState } from "react";

const useIsEasterEgg = () => {
  let sequence = "";
  const [isCaca, setIsCaca] = useState<boolean>(false);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
      sequence += e.key;

      if (sequence.includes("caca")) {
        setIsCaca(true);
      }
    }
  }

  function handleDoubleTouch(e: TouchEvent) {
    if (e.touches.length > 1) {
      setIsCaca(true);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleDoubleTouch);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleDoubleTouch);
    };
  }, []);

  return { isCaca };
};

export default useIsEasterEgg;
