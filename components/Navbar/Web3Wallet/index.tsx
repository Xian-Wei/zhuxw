import styles from "./web3wallet.module.scss";
import useWeb3Provider from "../../../hooks/useWeb3Provider";
import useIsMetamaskInstalled from "../../../hooks/useIsMetamaskInstalled";
import useWeb3Wallet from "../../../hooks/useWeb3Wallet";
import useIsWidth from "../../../hooks/useIsWidth";
import { WindowWidth } from "../../../models/WindowWidth";

const Web3Wallet = () => {
  const { wallet, setWallet } = useWeb3Wallet();
  const provider = useWeb3Provider();
  const isMetamaskInstalled = useIsMetamaskInstalled();
  const isWidth = useIsWidth(WindowWidth.md);
  const shortenedWallet =
    wallet !== "" ? `${wallet.substring(0, 5)}...${wallet.slice(-3)}` : "";

  const connect = async () => {
    try {
      if (provider) {
        await provider.send("eth_requestAccounts", []);

        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setWallet(address);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isMetamaskInstalled) {
    return null;
  }

  if (!isWidth && wallet !== "") {
    return null;
  }

  return (
    <div className={styles.button} onClick={connect}>
      {wallet !== "" ? shortenedWallet : "Connect"}
    </div>
  );
};

export default Web3Wallet;
