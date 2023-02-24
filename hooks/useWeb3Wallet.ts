import { useState, useEffect } from "react";
import useWeb3Provider from "./useWeb3Provider";

const useWeb3Wallet = () => {
  const [wallet, setWallet] = useState<string>("");
  const provider = useWeb3Provider();

  useEffect(() => {
    const initialize = async () => {
      if (provider) {
        const accounts: string[] = await provider.listAccounts();

        if (accounts.length > 0) {
          setWallet(accounts[0]);
        }
      }
    };
    initialize();

    if (window.ethereum && provider) {
      window.ethereum.on("accountsChanged", (account: string) => {
        setWallet(account[0]);
      });
    }
  }, [provider]);

  return { wallet, setWallet };
};

export default useWeb3Wallet;
