import React, { useEffect, useState } from "react";
import styles from "./web3network.module.scss";
import { Chains } from "../../models/Chains";
import useIsMetamaskInstalled from "../../hooks/useIsMetamaskInstalled";
import useWeb3ChainId from "../../hooks/useWeb3Network";

const Web3Network = () => {
  const [network, setNetwork] = useState<string>("");
  const [supported, setSupported] = useState<boolean>(false);
  const chainId: number | null = useWeb3ChainId();
  const isMetamaskInstalled = useIsMetamaskInstalled();

  useEffect(() => {
    if (chainId) {
      if (Chains[chainId] != undefined) {
        setSupported(Chains[chainId].supported);
        setNetwork(Chains[chainId].name);
      } else {
        setSupported(false);
        setNetwork("No");
      }
    }
  }, [chainId]);

  if (isMetamaskInstalled) {
    return (
      <div
        className={supported ? styles.supportedChain : styles.unsupportedChain}
      >
        {network}
      </div>
    );
  } else return <> </>;
};

export default Web3Network;
