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
import MetaTags from "../../components/MetaTags";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import PositionLine from "../../components/PositionLine";
import LoadingAnimation from "../../components/LoadingAnimation";

enum PositionType {
  Long,
  Short,
}

const Chart = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.Weekly);
  const [positionType, setPositionType] = useState<PositionType>(
    PositionType.Short
  );
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: weeklyWeights }: { data: any } = useSWR(
    "https://zhuxw.com/weight_weekly.json",
    fetcher
  );
  const { data: dailyWeights }: { data: any } = useSWR(
    "https://zhuxw.com/weight_daily.json",
    fetcher
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);

  const provider: ethers.providers.Web3Provider | null = useWeb3Provider();
  const { wallet } = useWeb3Wallet();
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
  const [positions, setPositions] = useState([]);
  const [isFaucetLocked, setIsFaucetLocked] = useState<boolean>(true);
  const [approved, setApproved] = useState<boolean>(false);
  const MINIMUM_AMOUNT = 1000;

  const setLongShortValue = (value: string) => {
    const regex = /^[0-9\b]+$/;

    if (value === "" || regex.test(value)) {
      if (Number(value) <= Number(balance)) {
        setAmount(Number(value));
      } else {
        setAmount(Number(balance));
      }
    }
  };

  const short = async () => {
    if (zhuExchangeContractAddress && provider) {
      try {
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
        setIsLoading(true);
        await tx.wait();
        console.log("Short submitted");
        await getBalance();
        setApproved(false);
        setAmount(0);
        await getPositions();
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const long = async () => {
    if (zhuExchangeContractAddress && provider) {
      try {
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
        setIsLoading(true);
        await tx.wait();
        console.log("Long submitted");
        await getBalance();
        setApproved(false);
        setAmount(0);
        await getPositions();
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const approve = async () => {
    if (zhuContractAddress && provider) {
      try {
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
        setIsLoading(true);
        await tx.wait();
        console.log(`Approved ${amount} ZHU`);
        setApproved(true);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const faucet = async () => {
    if (zhuContractAddress && provider && !isFaucetLocked && !isFaucetLoading) {
      try {
        const signer = provider.getSigner();
        const zhuContract = new ethers.Contract(
          zhuContractAddress,
          zhuAbi,
          signer
        );
        await provider.send("eth_requestAccounts", []);

        const tx = await zhuContract.faucet({ gasLimit: 100000 });
        setIsFaucetLoading(true);
        setIsFaucetLocked(true);
        await tx.wait();
        await getBalance();
        setIsFaucetLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getBalance = async () => {
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
  };

  const getFaucetLockState = async () => {
    if (zhuContractAddress && provider) {
      try {
        const zhuContract = new ethers.Contract(
          zhuContractAddress,
          zhuAbi,
          provider
        );
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];

        const locked = await zhuContract.isFaucetLockedFor(account);
        setIsFaucetLocked(locked);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getPositions = async () => {
    if (zhuExchangeContractAddress && provider) {
      try {
        const zhuExchangeContract = new ethers.Contract(
          zhuExchangeContractAddress,
          zhuExchangeAbi,
          provider
        );
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];

        const positions = await zhuExchangeContract.getPositionsOf(account);
        setPositions(positions);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (wallet) {
        getFaucetLockState();
      }
    }, 1000);

    (async () => {
      if (wallet) {
        await getBalance();
        await getPositions();
      }
    })();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chainId, wallet]);

  useEffect(() => {
    if (provider) {
      let positionAdded: any = {
        address: zhuExchangeContractAddress,
        topics: [ethers.utils.id("PositionAdded()")],
      };
      provider.on(positionAdded, async () => {
        await getPositions();
      });

      let tradesExecuted: any = {
        address: zhuExchangeContractAddress,
        topics: [ethers.utils.id("TradesExecuted()")],
      };
      provider.on(tradesExecuted, async () => {
        await getBalance();
      });

      return () => {
        provider.off(positionAdded);
        provider.off(tradesExecuted);
      };
    }
  }, [provider]);

  const LongShortButton = () => {
    if (wallet) {
      if (zhuExchangeContractAddress) {
        if (!isLoading) {
          if (amount == 0) {
            return <div className={styles.disabledButton}>Enter an amount</div>;
          } else if (amount >= MINIMUM_AMOUNT) {
            if (approved) {
              if (positionType == PositionType.Short) {
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
                    positionType == PositionType.Short
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
            return (
              <div className={styles.disabledButton}>
                Min {MINIMUM_AMOUNT} $ZHU
              </div>
            );
          }
        } else {
          return (
            <div className={styles.disabledButton}>
              <LoadingAnimation />
            </div>
          );
        }
      } else {
        return <div className={styles.disabledButton}>Change network</div>;
      }
    } else {
      return <div className={styles.disabledButton}>Connect your wallet</div>;
    }
  };

  return (
    <Layout
      navbarEnabled={true}
      footerEnabled={false}
      backgroundEnabled={false}
    >
      <Head>
        <title>
          {weeklyWeights && dailyWeights
            ? (timeframe == Timeframe.Daily && weeklyWeights && dailyWeights
                ? dailyWeights.reverse()[0].close
                : weeklyWeights.reverse()[0].close
              ).toString() + " KG | XWZ/KG"
            : "XWZ/KG"}
        </title>
        <MetaTags
          title={
            weeklyWeights && dailyWeights
              ? (timeframe == Timeframe.Daily && weeklyWeights && dailyWeights
                  ? dailyWeights.reverse()[0].close
                  : weeklyWeights.reverse()[0].close
                ).toString() + " KG | XWZ/KG"
              : "XWZ/KG"
          }
          description={
            "Xian-Wei Zhu's weight in a candlestick chart. Highly volatile and unpredictable, trade at your own risk. Not financial advice."
          }
          url={"https://zhuxw.com/chart"}
        />
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
          <div className={styles.positionContainer}>
            <div className={styles.positionDescription}>
              <div className={styles.positionSymbol}>Symbol</div>
              <div className={styles.positionSize}>Size</div>
              <div className={styles.positionEntryPrice}>Entry</div>
              <div className={styles.positionLiquidationPrice}>Liquidation</div>
              <div className={styles.positionPNL}>PNL</div>
            </div>
            <div className={styles.positions}>
              {dailyWeights &&
                positions.map((position: any, index: number) => {
                  return (
                    <PositionLine
                      amount={position.amount.toString()}
                      positionType={position.positionType}
                      weightSnapshot={position.weightSnapshot / 10}
                      currentWeight={
                        dailyWeights[dailyWeights.length - 1].close
                      }
                      key={index}
                    />
                  );
                })}
            </div>
          </div>
        </div>
        {/* Right */}
        <div className={styles.rightContainer}>
          <div className={styles.tabs}>
            <div
              className={
                positionType == PositionType.Short
                  ? styles.shortSwitchTabActive
                  : styles.shortSwitchTab
              }
              onClick={() => setPositionType(PositionType.Short)}
            >
              Short
            </div>
            <div
              className={
                positionType == PositionType.Long
                  ? styles.longSwitchTabActive
                  : styles.longSwitchTab
              }
              onClick={() => setPositionType(PositionType.Long)}
            >
              Long
            </div>
          </div>
          <div className={styles.sliders}>
            {dailyWeights && weeklyWeights && (
              <>
                {zhuContractAddress && wallet && (
                  <div className={styles.balance}>Balance : {balance} ZHU</div>
                )}
                <div
                  className={
                    zhuExchangeContractAddress && wallet
                      ? styles.amountInputBox
                      : styles.amountInputBoxDisabled
                  }
                >
                  <div className={styles.amountLabel}>Weight</div>
                  <div className={styles.amountText}>
                    {dailyWeights[dailyWeights.length - 1].close}
                  </div>
                  <div className={styles.amountTicker}>KG</div>
                </div>
                <div
                  className={
                    zhuExchangeContractAddress && wallet
                      ? styles.amountInputBox
                      : styles.amountInputBoxDisabled
                  }
                >
                  <div className={styles.amountLabel}>Amount</div>
                  <input
                    type="text"
                    min={0}
                    max={balance}
                    className={styles.amountInput}
                    value={amount}
                    onChange={(e) => {
                      setLongShortValue(e.target.value);
                    }}
                  />
                  <div className={styles.amountTicker}>ZHU</div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={balance}
                  step={1}
                  disabled={!zhuExchangeContractAddress || !wallet}
                  className={styles.amountSlider}
                  value={amount}
                  onChange={(e) => {
                    setLongShortValue(e.target.value);
                  }}
                />
              </>
            )}
          </div>
          {zhuContractAddress ? (
            <div
              className={
                !isFaucetLocked &&
                zhuContractAddress &&
                wallet &&
                !isFaucetLoading
                  ? styles.faucet
                  : styles.disabledFaucet
              }
              onClick={faucet}
            >
              {isFaucetLoading ? <LoadingAnimation /> : "Faucet"}
            </div>
          ) : (
            <div className={styles.disabledFaucet}>Not available</div>
          )}
          <LongShortButton />
        </div>
      </div>
    </Layout>
  );
};

export default Chart;
