import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useWeb3Provider = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum, "any"));
    }
  }, []);

  return provider;
};

export default useWeb3Provider;
