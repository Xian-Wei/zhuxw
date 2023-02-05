import { useState, useEffect } from "react";

const useIsMetamaskInstalled = () => {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    if (window.ethereum) {
      setIsInstalled(true);
    }
  }, []);

  return isInstalled;
};

export default useIsMetamaskInstalled;
