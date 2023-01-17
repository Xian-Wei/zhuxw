import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useWeb3Provider = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);

  return provider;
};

export default useWeb3Provider;
