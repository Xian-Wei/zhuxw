import { useState, useEffect } from "react";
import useWeb3Provider from "./useWeb3Provider";

const useWeb3ChainId = () => {
  const [chainId, setChainId] = useState<number | null>(null);
  const provider = useWeb3Provider();

  useEffect(() => {
    (async () => {
      if (window.ethereum && provider) {
        const newNetwork = await provider._networkPromise;
        setChainId(newNetwork.chainId);

        window.ethereum.on("chainChanged", (chain: string) =>
          setChainId(Number(chain))
        );
      }
    })();
  }, [provider]);

  return chainId;
};

export default useWeb3ChainId;
