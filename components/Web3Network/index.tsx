import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useWeb3Provider from "../../hooks/useWeb3Provider";
import styles from "./web3network.module.scss";
import { Chains } from "../../models/Chains";
import useIsMetamaskInstalled from "../../hooks/useIsMetamaskInstalled";

const Web3Network = () => {
  const [network, setNetwork] = useState<string>("");
  const [supported, setSupported] = useState<boolean>(false);
  const provider = useWeb3Provider();
  const isMetamaskInstalled = useIsMetamaskInstalled();

  const setNetworkName = (chain: string) => {
    const chainId: number = Number(chain);

    if (Chains[chainId] != undefined) {
      setSupported(Chains[chainId].supported);
      setNetwork(Chains[chainId].name);
    } else {
      setSupported(false);
      setNetwork("No");
    }
  };

  useEffect(() => {
    (async () => {
      if (window.ethereum && provider) {
        const newNetwork = await provider._networkPromise;
        setNetworkName(newNetwork.chainId.toString());

        window.ethereum.on("chainChanged", (chain: string) =>
          setNetworkName(chain)
        );
      }
    })();
  }, [provider]);

  if (isMetamaskInstalled) {
    return (
      <div
        className={supported ? styles.supportedChain : styles.unsupportedChain}
      >
        {network}
      </div>
    );
  }
};

export default Web3Network;
