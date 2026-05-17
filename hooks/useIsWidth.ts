import { useState, useEffect } from "react";
import { WindowWidth } from "../models/WindowWidth";
import { breakpoints } from "../styles/breakpoints";

const useIsWidth = (windowWidth: WindowWidth) => {
  const [isWidth, setIsWidth] = useState<boolean>(false);
  let size: number;

  switch (windowWidth) {
    case WindowWidth.sm:
      size = breakpoints.sm;
      break;
    case WindowWidth.md:
      size = breakpoints.md;
      break;
    case WindowWidth.lg:
      size = breakpoints.lg;
      break;
    case WindowWidth.xl:
      size = breakpoints.xl;
      break;
    case WindowWidth.xxl:
      size = breakpoints.xxl;
      break;
  }

  const handleWindowSizeChange = () => {
    setIsWidth(window.innerWidth >= size);
  };

  useEffect(() => {
    handleWindowSizeChange();

    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return isWidth;
};

export default useIsWidth;
