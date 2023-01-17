import { useState, useEffect } from "react";

import styles from "./web3wallet.module.scss";
import useWeb3Provider from "../../hooks/useWeb3Provider";

const Web3Wallet = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const provider = useWeb3Provider();

  const connect = async () => {
    if (provider) {
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
    }
  };

  const initialize = async () => {
    if (provider) {
      const accounts: string[] = await provider.listAccounts();

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    }
  };

  useEffect(() => {
    initialize();
  }, [provider]);

  return (
    <div className={styles.button} onClick={connect}>
      {walletAddress != ""
        ? walletAddress.substring(0, 5) +
          "..." +
          walletAddress.substring(
            walletAddress.length - 3,
            walletAddress.length
          )
        : "Connect"}
    </div>
  );
};

export default Web3Wallet;
