import { useState, useEffect } from "react";
import useWeb3Provider from "./useWeb3Provider";
import { JsonRpcSigner } from "ethers";

const useWeb3Wallet = () => {
  const [wallet, setWallet] = useState<string>("");
  const provider = useWeb3Provider();

  useEffect(() => {
    const initialize = async () => {
      if (provider) {
        const accounts: JsonRpcSigner[] = await provider.listAccounts();

        if (accounts.length > 0) {
          setWallet(accounts[0].address);
        }
      }
    };
    initialize();

    if (window.ethereum && provider) {
      window.ethereum.on("accountsChanged", (account: string) => {
        if (account.length > 0) setWallet(account[0]);
        else setWallet("");
      });
    }
  }, [provider]);

  return { wallet, setWallet };
};

export default useWeb3Wallet;
