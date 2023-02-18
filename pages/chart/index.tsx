import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useSWR from "swr";
import axios from "axios";

import Layout from "../../components/Layout";
import LWChart from "../../components/LWChart";
import { Timeframe } from "../../models/Timeframe";
import styles from "./chart.module.scss";
import useWeb3Provider from "../../hooks/useWeb3Provider";
import useWeb3ChainId from "../../hooks/useWeb3Network";
import contractAddresses from "../../data/artifacts/contractAddresses.json";
import zhuAbi from "../../data/artifacts/Zhu.json";
import zhuExchangeAbi from "../../data/artifacts/ZhuExchange.json";

enum Position {
  Long,
  Short,
}

const Chart = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.Weekly);
  const [position, setPosition] = useState<Position>(Position.Short);
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: weeklyWeights }: { data: any } = useSWR(
    "https://zhuxw.com/weight_weekly.json",
    fetcher
  );
  const { data: dailyWeights }: { data: any } = useSWR(
    "https://zhuxw.com/weight_daily.json",
    fetcher
  );

  const provider: ethers.providers.Web3Provider | null = useWeb3Provider();
  const chainId: number | null = useWeb3ChainId();
  const zhuContractAddress: string | null = chainId
    ? String(chainId) in contractAddresses
      ? contractAddresses[String(chainId) as keyof typeof contractAddresses][0]
      : null
    : null;
  const zhuExchangeContractAddress: string | null = chainId
    ? String(chainId) in contractAddresses
      ? contractAddresses[String(chainId) as keyof typeof contractAddresses][1]
      : null
    : null;

  const [balance, setBalance] = useState<string>("0");
  const [amount, setAmount] = useState<number>(0);
  const [isFaucetLocked, setIsFaucetLocked] = useState<boolean>(true);
  const [approved, setApproved] = useState<boolean>(false);

  const setLongShortValue = (value: number) => {
    if (value >= 0 && value <= Number(balance)) {
      setAmount(value);
    }
  };

  const short = async () => {
    if (zhuExchangeContractAddress && provider) {
      const signer = provider.getSigner();
      const zhuExchangeContract = new ethers.Contract(
        zhuExchangeContractAddress,
        zhuExchangeAbi,
        signer
      );
      await provider.send("eth_requestAccounts", []);

      const tx = await zhuExchangeContract.short(
        amount,
        dailyWeights[dailyWeights.length - 1].close * 10,
        { gasLimit: 1000000 }
      );
      await tx.wait();
      console.log("Short submitted");
      await getBalance();
      setApproved(false);
    }
  };

  const long = async () => {
    if (zhuExchangeContractAddress && provider) {
      const signer = provider.getSigner();
      const zhuExchangeContract = new ethers.Contract(
        zhuExchangeContractAddress,
        zhuExchangeAbi,
        signer
      );
      await provider.send("eth_requestAccounts", []);

      const tx = await zhuExchangeContract.long(
        amount,
        dailyWeights[dailyWeights.length - 1].close * 10,
        { gasLimit: 1000000 }
      );
      await tx.wait();
      console.log("Long submitted");
      await getBalance();
      setApproved(false);
    }
  };

  const approve = async () => {
    if (zhuContractAddress && provider) {
      const signer = provider.getSigner();
      const zhuContract = new ethers.Contract(
        zhuContractAddress,
        zhuAbi,
        signer
      );
      await provider.send("eth_requestAccounts", []);

      const tx = await zhuContract._approve(
        zhuExchangeContractAddress,
        amount,
        { gasLimit: 100000 }
      );
      await tx.wait();
      console.log(`Approved ${amount} ZHU`);
      setApproved(true);
    }
  };

  const faucet = async () => {
    if (zhuContractAddress && provider && !isFaucetLocked) {
      const signer = provider.getSigner();
      const zhuContract = new ethers.Contract(
        zhuContractAddress,
        zhuAbi,
        signer
      );
      await provider.send("eth_requestAccounts", []);

      const tx = await zhuContract.faucet({ gasLimit: 100000 });
      await tx.wait();
      await getBalance();
    }
  };

  const getBalance = async () => {
    if (zhuContractAddress && provider) {
      const zhuContract = new ethers.Contract(
        zhuContractAddress,
        zhuAbi,
        provider
      );
      let accounts = await provider.send("eth_requestAccounts", []);
      let account = accounts[0];

      const balance = await zhuContract.balanceOf(account);
      setBalance(
        balance.toString().substring(0, balance.toString().length - 18)
      );
    } else setBalance("Not supported");
  };

  const getFaucetLockState = async () => {
    if (zhuContractAddress && provider) {
      const zhuContract = new ethers.Contract(
        zhuContractAddress,
        zhuAbi,
        provider
      );
      let accounts = await provider.send("eth_requestAccounts", []);
      let account = accounts[0];

      const locked = await zhuContract.isFaucetLockedFor(account);
      setIsFaucetLocked(locked);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getFaucetLockState();
    }, 1000);

    getBalance();

    return () => {
      clearInterval(interval);
    };
  }, [chainId]);

  const LongShortButton = () => {
    if (zhuExchangeContractAddress) {
      if (approved) {
        if (position == Position.Short) {
          return (
            <div className={styles.shortButton} onClick={() => short()}>
              Short
            </div>
          );
        } else {
          return (
            <div className={styles.longButton} onClick={() => long()}>
              Long
            </div>
          );
        }
      } else {
        return (
          <div
            className={
              position == Position.Short
                ? styles.shortButton
                : styles.longButton
            }
            onClick={() => approve()}
          >
            Approve
          </div>
        );
      }
    } else {
      return <div className={styles.disabledButton}>Not available</div>;
    }
  };

  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={false}>
      <Head>
        <title>
          {weeklyWeights && dailyWeights
            ? (timeframe == Timeframe.Daily && weeklyWeights && dailyWeights
                ? dailyWeights.reverse()[0].close
                : weeklyWeights.reverse()[0].close
              ).toString() + " KG | XWZ/KG"
            : "XWZ/KG"}
        </title>
        <meta
          name="og:title"
          content={
            weeklyWeights && dailyWeights
              ? (timeframe == Timeframe.Daily
                  ? dailyWeights.reverse()[0].close
                  : weeklyWeights.reverse()[0].close
                ).toString() + " KG | XWZ/KG"
              : "XWZ/KG"
          }
        />
        <meta
          name="og:description"
          content="Xian-Wei Zhu's weight in a candlestick chart. Highly volatile and unpredictable, trade at your own risk. Not financial advice."
        />
        <meta
          property="og:image"
          content={`https://zhuxw.com/images/comedy.png`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        {/* Left */}
        <div className={styles.leftContainer}>
          <div className={styles.infoContainer}>XWZ / KG</div>
          <div className={styles.chart}>
            <div className={styles.timeframeButtons}>
              <div
                className={
                  timeframe == Timeframe.Daily
                    ? styles.timeframeButtonActive
                    : styles.timeframeButton
                }
                onClick={() => setTimeframe(Timeframe.Daily)}
              >
                1D
              </div>
              <div
                className={
                  timeframe == Timeframe.Weekly
                    ? styles.timeframeButtonActive
                    : styles.timeframeButton
                }
                onClick={() => setTimeframe(Timeframe.Weekly)}
              >
                1W
              </div>
            </div>

            <LWChart
              weeklyWeights={weeklyWeights}
              dailyWeights={dailyWeights}
              timeframe={timeframe}
            />
          </div>
          <div className={styles.positions}>Positions</div>
        </div>
        {/* Right */}
        <div className={styles.rightContainer}>
          <div className={styles.tabs}>
            <div
              className={
                position == Position.Short
                  ? styles.shortSwitchTabActive
                  : styles.shortSwitchTab
              }
              onClick={() => setPosition(Position.Short)}
            >
              Short
            </div>
            <div
              className={
                position == Position.Long
                  ? styles.longSwitchTabActive
                  : styles.longSwitchTab
              }
              onClick={() => setPosition(Position.Long)}
            >
              Long
            </div>
          </div>
          <div className={styles.sliders}>
            <div className={styles.balance}>Balance : {balance}</div>
            {zhuContractAddress ? (
              <div
                className={
                  isFaucetLocked ? styles.disabledFaucet : styles.faucet
                }
                onClick={faucet}
              >
                Faucet
              </div>
            ) : (
              <div className={styles.disabledFaucet}>
                Not available on this network
              </div>
            )}
            {zhuExchangeContractAddress && (
              <input
                type="number"
                min={0}
                max={balance}
                className={styles.amountInput}
                onChange={(e) => {
                  setLongShortValue(e.target.valueAsNumber);
                }}
              ></input>
            )}
          </div>
          <LongShortButton />
        </div>
      </div>
    </Layout>
  );
};

export default Chart;
