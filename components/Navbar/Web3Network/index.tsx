import React, { useEffect, useState } from "react";
import styles from "./web3network.module.scss";
import { Chains } from "../../../models/Chains";
import useWeb3ChainId from "../../../hooks/useWeb3Network";
import useWeb3Wallet from "../../../hooks/useWeb3Wallet";

const Web3Network = () => {
  const [network, setNetwork] = useState<string>("");
  const [supported, setSupported] = useState<boolean>(false);
  const chainId: number | null = useWeb3ChainId();
  const [showNetworkList, setShowNetworkList] = useState(false);
  const { wallet } = useWeb3Wallet();

  const switchNetwork = async (chainId: number) => {
    setShowNetworkList(false);
    if (window.ethereum) {
      try {
        switch (chainId) {
          case 31337:
            window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x7A69",
                  rpcUrls: ["http://localhost:8545"],
                  chainName: "Localhost",
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: null,
                },
              ],
            });
            break;
          case 80001:
            window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881",
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
                  chainName: "Mumbai",
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: null,
                },
              ],
            });
            break;
          case 11155111:
            window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xAA36A7",
                  rpcUrls: ["https://sepolia.infura.io/v3/"],
                  chainName: "Sepolia test network",
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "SepoliaETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
            break;
        }
      } finally {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      }
    }
  };

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

  if (wallet) {
    return (
      <>
        <div
          className={
            supported ? styles.supportedChain : styles.unsupportedChain
          }
          onClick={() => setShowNetworkList(!showNetworkList)}
        >
          {network}
        </div>
        {showNetworkList && (
          <div className={styles.networkList}>
            <div
              className={styles.network}
              onClick={() => switchNetwork(11155111)}
            >
              Sepolia
            </div>
            <div
              className={styles.network}
              onClick={() => switchNetwork(80001)}
            >
              Mumbai
            </div>
            <div
              className={styles.network}
              onClick={() => switchNetwork(31337)}
            >
              Localhost
            </div>
          </div>
        )}
      </>
    );
  } else return <> </>;
};

export default Web3Network;
