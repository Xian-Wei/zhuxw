import Head from "next/head";
import React, { useCallback, useState, useEffect } from "react";
import MetaTags from "../../components/MetaTags";
import styles from "./shop.module.scss";
import useWeb3ChainId from "../../hooks/useWeb3Network";
import contractAddresses from "../../data/artifacts/contractAddresses.json";
import zhuAbi from "../../data/artifacts/Zhu.json";
import zhubaAbi from "../../data/artifacts/Zhuba.json";
import { ethers } from "ethers";
import useWeb3Provider from "../../hooks/useWeb3Provider";
import NFTCard from "../../components/Web3/NFTCard";

export const siteTitle = "XWZ Web3 Shop";

const Shop = () => {
  const provider: ethers.providers.Web3Provider | null = useWeb3Provider();
  const chainId: number | null = useWeb3ChainId();
  const zhuContractAddress: string | null = chainId
    ? String(chainId) in contractAddresses
      ? contractAddresses[String(chainId) as keyof typeof contractAddresses][
          "Zhu"
        ][0]
      : null
    : null;
  const zhubaContractAddress: string | null = chainId
    ? String(chainId) in contractAddresses
      ? contractAddresses[String(chainId) as keyof typeof contractAddresses][
          "Zhuba"
        ][0]
      : null
    : null;

  const [balance, setBalance] = useState("0");
  const [isInteractible, setIsInteractible] = useState(false);

  const approve = async () => {
    if (zhuContractAddress && zhubaContractAddress && provider) {
      try {
        const signer = await provider.getSigner();
        const zhuContract = new ethers.Contract(
          zhuContractAddress,
          zhuAbi,
          signer
        );
        const zhubaContract = new ethers.Contract(
          zhubaContractAddress,
          zhubaAbi,
          signer
        );
        await provider.send("eth_requestAccounts", []);

        const mintFee = await zhubaContract.getMintFee();

        const tx = await zhuContract._approve(zhubaContractAddress, mintFee, {
          gasLimit: 100000,
        });
        await tx.wait();
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  };

  const mint = async () => {
    if (zhubaContractAddress && provider) {
      try {
        const signer = await provider.getSigner();
        const zhubaContract = new ethers.Contract(
          zhubaContractAddress,
          zhubaAbi,
          signer
        );
        await provider.send("eth_requestAccounts", []);

        const tx = await zhubaContract.requestNft({
          gasLimit: 3000000,
        });
        await tx.wait();
        await getBalance();
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  };

  const getBalance = useCallback(async () => {
    if (zhuContractAddress && provider) {
      try {
        const zhuContract = new ethers.Contract(
          zhuContractAddress,
          zhuAbi,
          provider
        );
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];

        const balance = await zhuContract.balanceOf(account);

        if (balance.toString() != "0") {
          setBalance(
            balance.toString().substring(0, balance.toString().length - 18)
          );
        } else setBalance("0");

        return true;
      } catch (e) {
        console.error(e);
      }
    } else {
      setBalance("0");
      return false;
    }
  }, [provider, zhuContractAddress]);

  useEffect(() => {
    (async () => {
      await getBalance();
    })();
  }, [chainId, getBalance]);

  useEffect(() => {
    if (provider && zhuContractAddress && zhubaContractAddress) {
      setIsInteractible(true);
    } else setIsInteractible(false);
  }, [provider, zhuContractAddress, zhubaContractAddress]);

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "The zhuxw shop is the world's most useless Web3 shop as it exclusively contains worthless NFTs."
          }
          url={"https://zhuxw.com/shop"}
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.balance}>Balance: {balance} $ZHU</div>
        <div className={styles.card}>
          <NFTCard
            title="Zhuba NFT Gacha"
            price={10000}
            image="/images/zhuba.gif"
            alt="Zhuba GIF"
            approve={approve}
            mint={mint}
            isInteractible={isInteractible}
          />
        </div>
      </div>
    </>
  );
};

export default Shop;
