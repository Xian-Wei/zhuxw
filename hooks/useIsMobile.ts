import { useState, useEffect } from "react";
import constants from "../styles/constants.module.scss";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const size = parseInt(constants.md.slice(0, -2));

  let handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth <= size);
  };

  useEffect(() => {
    handleWindowSizeChange();

    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
