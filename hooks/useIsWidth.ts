import { useState, useEffect } from "react";
import { WindowWidth } from "../models/WindowWidth";
import constants from "../styles/constants.module.scss";

const useIsWidth = (windowWidth: WindowWidth) => {
  const [isWidth, setIsWidth] = useState<boolean>(false);
  let size: number;

  switch (windowWidth) {
    case WindowWidth.sm:
      size = parseInt(constants.sm.slice(0, -2));
      break;
    case WindowWidth.md:
      size = parseInt(constants.md.slice(0, -2));
      break;
    case WindowWidth.lg:
      size = parseInt(constants.lg.slice(0, -2));
      break;
    case WindowWidth.xl:
      size = parseInt(constants.xl.slice(0, -2));
      break;
    case WindowWidth.xxl:
      size = parseInt(constants.xxl.slice(0, -2));
      break;
  }

  let handleWindowSizeChange = () => {
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
