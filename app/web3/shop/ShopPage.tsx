"use client";

import React, { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./shop.module.scss";
import useWeb3ChainId from "../../../hooks/useWeb3Network";
import contractAddresses from "../../../data/artifacts/contractAddresses.json";
import zhuAbi from "../../../data/artifacts/Zhu.json";
import zhubaAbi from "../../../data/artifacts/Zhuba.json";
import { ethers } from "ethers";
import useWeb3Provider from "../../../hooks/useWeb3Provider";
import LoadingAnimation from "../../../components/LoadingAnimation";

const rarities = [
  { label: "UR", name: "Ultra Rare",  rate: 5,  color: "#FFD700" },
  { label: "SR", name: "Super Rare",  rate: 10, color: "#C77DFF" },
  { label: "R",  name: "Rare",        rate: 15, color: "#48CAE4" },
  { label: "U",  name: "Uncommon",    rate: 30, color: "#69DB7C" },
  { label: "C",  name: "Common",      rate: 40, color: "#A0A0B0" },
];

const ShopPage = () => {
  const provider: ethers.BrowserProvider | null = useWeb3Provider();
  const chainId: number | null = useWeb3ChainId();
  const zhuContractAddress: string | null = chainId
    ? String(chainId) in contractAddresses
      ? contractAddresses[String(chainId) as keyof typeof contractAddresses]["Zhu"][0]
      : null
    : null;
  const zhubaContractAddress: string | null = chainId
    ? String(chainId) in contractAddresses
      ? contractAddresses[String(chainId) as keyof typeof contractAddresses]["Zhuba"][0]
      : null
    : null;

  const [balance, setBalance] = useState("0");
  const [approved, setApproved] = useState(false);
  const [minted, setMinted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const approve = async () => {
    if (zhuContractAddress && zhubaContractAddress && provider) {
      try {
        const signer = await provider.getSigner();
        const zhuContract = new ethers.Contract(zhuContractAddress, zhuAbi, signer);
        const zhubaContract = new ethers.Contract(zhubaContractAddress, zhubaAbi, signer);
        await provider.send("eth_requestAccounts", []);
        const mintFee = await zhubaContract.getMintFee();
        const tx = await zhuContract._approve(zhubaContractAddress, mintFee, { gasLimit: 100000 });
        await tx.wait();
        setApproved(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const mint = async () => {
    if (zhubaContractAddress && provider) {
      try {
        const signer = await provider.getSigner();
        const zhubaContract = new ethers.Contract(zhubaContractAddress, zhubaAbi, signer);
        await provider.send("eth_requestAccounts", []);
        const tx = await zhubaContract.requestNft({ gasLimit: 3000000 });
        await tx.wait();
        await getBalance();
        setMinted(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getBalance = useCallback(async () => {
    if (zhuContractAddress && provider) {
      try {
        const zhuContract = new ethers.Contract(zhuContractAddress, zhuAbi, provider);
        const accounts = await provider.send("eth_requestAccounts", []);
        const bal = await zhuContract.balanceOf(accounts[0]);
        setBalance(
          bal.toString() !== "0"
            ? bal.toString().substring(0, bal.toString().length - 18)
            : "0"
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      setBalance("0");
    }
  }, [provider, zhuContractAddress]);

  useEffect(() => {
    (async () => { await getBalance(); })();
  }, [chainId, getBalance]);

  const MintButton = () => {
    if (!zhuContractAddress || !zhubaContractAddress)
      return <div className={styles.disabledButton}>Not available</div>;
    if (isLoading) return <div className={styles.disabledButton}><LoadingAnimation /></div>;
    if (minted) return <div className={styles.mintButton}>Minted!</div>;
    if (approved) return <div className={styles.mintButton} onClick={mint}>Mint</div>;
    return <div className={styles.mintButton} onClick={() => { setIsLoading(true); approve(); }}>Approve</div>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.balance}>Balance: {balance} $ZHU</div>
      <div className={styles.main}>
        <div className={styles.gifWrapper}>
          <Image
            src="/images/zhuba.gif"
            alt="Zhuba NFT"
            fill
            className={styles.gif}
            unoptimized
          />
        </div>
        <div className={styles.panel}>
          <div className={styles.nftTitle}>Zhuba NFT Gacha</div>
          <div className={styles.nftPrice}>10,000 $ZHU</div>
          <MintButton />
          <div className={styles.divider} />
          <div className={styles.rarityTitle}>Rarity Rates</div>
          <div className={styles.rarityList}>
            {rarities.map(({ label, name, rate, color }) => (
              <div key={label} className={styles.rarityRow}>
                <span className={styles.rarityLabel} style={{ color }}>{label}</span>
                <span className={styles.rarityName}>{name}</span>
                <div className={styles.rarityBarTrack}>
                  <div className={styles.rarityBarFill} style={{ width: `${rate}%`, background: color }} />
                </div>
                <span className={styles.rarityRate}>{rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
