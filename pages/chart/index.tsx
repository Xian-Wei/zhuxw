import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import useSWR from "swr";
import axios from "axios";

import LWChart from "../../components/Chart/LWChart";
import { Timeframe } from "../../models/Timeframe";
import styles from "./chart.module.scss";
import useWeb3Provider from "../../hooks/useWeb3Provider";
import useWeb3ChainId from "../../hooks/useWeb3Network";
import contractAddresses from "../../data/artifacts/contractAddresses.json";
import zhuAbi from "../../data/artifacts/Zhu.json";
import zhuExchangeAbi from "../../data/artifacts/ZhuExchange.json";
import MetaTags from "../../components/MetaTags";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import PositionLine from "../../components/Chart/PositionLine";
import LoadingAnimation from "../../components/LoadingAnimation";
import {
  getHighestHighInLastSevenElements,
  getLowestLowInLastSevenElements,
  percentageDifference,
} from "../../utils/ChartUtils";

enum PositionType {
  Long,
  Short,
}

const Chart = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.Weekly);
  const [positionType, setPositionType] = useState<PositionType>(
    PositionType.Short
  );

  // API
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: weeklyWeights }: { data: any } = useSWR(
    "https://zhuxw.com/weight_weekly.json",
    fetcher
  );
  const { data: dailyWeights }: { data: any } = useSWR(
    "https://zhuxw.com/weight_daily.json",
    fetcher
  );

  // Web3
  const provider: ethers.providers.Web3Provider | null = useWeb3Provider();
  const { wallet } = useWeb3Wallet();
  const chainId: number | null = useWeb3ChainId();
  const zhuContractAddress: string | null = chainId
    ? String(chainId) in contractAddresses
      ? contractAddresses[String(chainId) as keyof typeof contractAddresses][
          "Zhu"
        ][0]
      : null
    : null;
  const zhuExchangeContractAddress: string | null = chainId
    ? String(chainId) in contractAddresses
      ? contractAddresses[String(chainId) as keyof typeof contractAddresses][
          "ZhuExchange"
        ][0]
      : null
    : null;

  const [balance, setBalance] = useState<string>("0");
  const [amount, setAmount] = useState<number>(0);
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [isFaucetLocked, setIsFaucetLocked] = useState<boolean>(true);
  const MINIMUM_AMOUNT = 1000;

  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);

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
        const signer = await provider.getSigner();
        const zhuExchangeContract = new ethers.Contract(
          zhuExchangeContractAddress,
          zhuExchangeAbi,
          signer
        );
        await provider.send("eth_requestAccounts", []);

        const tx = await zhuExchangeContract.short(
          approvedAmount,
          dailyWeights[dailyWeights.length - 1].close * 10,
          { gasLimit: 1000000 }
        );
        setIsLoading(true);
        await tx.wait();
        await getBalance();
        await getPositions();
        setApproved(false);
        setIsLoading(false);
        setAmount(0);
        setApprovedAmount(0);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const long = async () => {
    if (zhuExchangeContractAddress && provider) {
      try {
        const signer = await provider.getSigner();
        const zhuExchangeContract = new ethers.Contract(
          zhuExchangeContractAddress,
          zhuExchangeAbi,
          signer
        );
        await provider.send("eth_requestAccounts", []);
        const tx = await zhuExchangeContract.long(
          approvedAmount,
          dailyWeights[dailyWeights.length - 1].close * 10,
          { gasLimit: 1000000 }
        );
        setIsLoading(true);
        await tx.wait();
        await getBalance();
        await getPositions();
        setApproved(false);
        setIsLoading(false);
        setAmount(0);
        setApprovedAmount(0);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const approve = async () => {
    if (zhuContractAddress && provider) {
      try {
        const signer = await provider.getSigner();
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
        setApprovedAmount(amount);
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
        const signer = await provider.getSigner();
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

  const getFaucetLockState = useCallback(async () => {
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
  }, [chainId, wallet]);

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
  }, [chainId, wallet]);

  const getPositions = useCallback(async () => {
    if (zhuExchangeContractAddress && provider) {
      try {
        const zhuExchangeContract = new ethers.Contract(
          zhuExchangeContractAddress,
          zhuExchangeAbi,
          provider
        );
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];

        let positions = await zhuExchangeContract.getPositionsOf(account);

        positions = positions.filter((position: any) => {
          return position.weightSnapshot != 0;
        });

        setPositions(positions);
      } catch (e) {
        console.error(e);
      }
    }
  }, [chainId, wallet]);

  const closeTrade = async (id: number) => {
    if (zhuExchangeContractAddress && provider) {
      try {
        const signer = await provider.getSigner();
        const zhuExchangeContract = new ethers.Contract(
          zhuExchangeContractAddress,
          zhuExchangeAbi,
          signer
        );
        await provider.send("eth_requestAccounts", []);

        const tx = await zhuExchangeContract.closeTrade(
          dailyWeights[dailyWeights.length - 1].close * 10,
          id,
          { gasLimit: 100000 }
        );
        await tx.wait();
        await getBalance();
        await getPositions();
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (wallet) {
        await getFaucetLockState();
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
  }, [chainId, wallet, getBalance, getPositions, getFaucetLockState]);

  useEffect(() => {
    if (provider) {
      // After a successful Long/Short
      let positionAdded: any = {
        address: zhuExchangeContractAddress,
        topics: [ethers.utils.id("PositionAdded()")],
      };
      provider.on(positionAdded, async () => {
        await getPositions();
      });

      // After trades are executed on-chain
      let tradesExecuted: any = {
        address: zhuExchangeContractAddress,
        topics: [ethers.utils.id("TradesExecuted()")],
      };
      provider.on(tradesExecuted, async () => {
        await getBalance();
        await getPositions();
      });

      return () => {
        provider.off(positionAdded);
        provider.off(tradesExecuted);
      };
    }
  }, [provider, getBalance, getPositions, zhuExchangeContractAddress]);

  const LongShortButton = () => {
    if (provider) {
      if (wallet) {
        if (zhuExchangeContractAddress) {
          if (!isLoading) {
            if (amount == 0) {
              return (
                <div className={styles.disabledButton}>Enter an amount</div>
              );
            } else if (amount >= MINIMUM_AMOUNT) {
              if (approved) {
                // Short
                if (positionType == PositionType.Short) {
                  return (
                    <div className={styles.shortButton} onClick={() => short()}>
                      Short
                    </div>
                  );
                }
                // Long
                else {
                  return (
                    <div className={styles.longButton} onClick={() => long()}>
                      Long
                    </div>
                  );
                }
              }
              // Not approved
              else {
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
            }
            // Amount is less than MINIMUM_AMOUNT
            else {
              return (
                <div className={styles.disabledButton}>
                  Min {MINIMUM_AMOUNT} $ZHU
                </div>
              );
            }
          }
          // Loading
          else {
            return (
              <div className={styles.disabledButton}>
                <LoadingAnimation />
              </div>
            );
          }
        }
        // No contract in this network
        else {
          return <div className={styles.disabledButton}>Change network</div>;
        }
      }
      // Wallet not connected
      else {
        return <div className={styles.disabledButton}>Connect your wallet</div>;
      }
    } else {
      return (
        <div className={styles.disabledButton}>Ethereum wallet required</div>
      );
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Head>
        <title>
          {weeklyWeights && dailyWeights
            ? (timeframe == Timeframe.Daily && weeklyWeights && dailyWeights
                ? dailyWeights[dailyWeights.length - 1].close
                : weeklyWeights[weeklyWeights.length - 1].close
              ).toString() + " KG | XWZ/KG"
            : "XWZ/KG"}
        </title>
        <MetaTags
          title={
            weeklyWeights && dailyWeights
              ? (timeframe == Timeframe.Daily && weeklyWeights && dailyWeights
                  ? dailyWeights[dailyWeights.length - 1].close
                  : weeklyWeights[weeklyWeights.length - 1].close
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
          <div className={styles.infoContainer}>
            {/* Pair */}
            <div className={styles.pair}>XWZ / KG</div>
            {/* Weight */}
            <div className={styles.currentWeight}>
              {dailyWeights && dailyWeights[dailyWeights.length - 1].close} KG
            </div>
            {/* 24h Change */}
            <div className={styles.labelGroup}>
              <div className={styles.label}>24h Change</div>
              {dailyWeights &&
                (percentageDifference(
                  dailyWeights[dailyWeights.length - 2].close,
                  dailyWeights[dailyWeights.length - 1].close
                ) < 0 ? (
                  <div className={styles.dailyChangeRed}>
                    {percentageDifference(
                      dailyWeights[dailyWeights.length - 2].close,
                      dailyWeights[dailyWeights.length - 1].close
                    ).toFixed(2)}
                    %
                  </div>
                ) : (
                  <div className={styles.dailyChangeGreen}>
                    +
                    {percentageDifference(
                      dailyWeights[dailyWeights.length - 2].close,
                      dailyWeights[dailyWeights.length - 1].close
                    ).toFixed(2)}
                    %
                  </div>
                ))}
            </div>
            {/* Weekly high */}
            <div className={styles.labelGroupNoMobile}>
              <div className={styles.label}>7d High</div>
              <div className={styles.weeklyHigh}>
                {getHighestHighInLastSevenElements(dailyWeights)} KG
              </div>
            </div>
            {/* Weekly low */}
            <div className={styles.labelGroupNoMobile}>
              <div className={styles.label}>7d Low</div>
              <div className={styles.weeklyLow}>
                {getLowestLowInLastSevenElements(dailyWeights)} KG
              </div>
            </div>
          </div>
          {/* Chart */}
          <div className={styles.chart}>
            {/* Timeframe buttons */}
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
            {/* Chart component */}
            <LWChart
              weeklyWeights={weeklyWeights}
              dailyWeights={dailyWeights}
              timeframe={timeframe}
            />
          </div>
          {/* Position */}
          <div className={styles.positionContainer}>
            <div className={styles.positionDescription}>
              <div className={styles.positionSymbol}>Symbol</div>
              <div className={styles.positionSize}>Size</div>
              <div className={styles.positionEntryPrice}>Entry</div>
              <div className={styles.positionLiquidationPrice}>Liquidation</div>
              <div className={styles.positionPNL}>PNL</div>
            </div>
            {/* Position lines*/}
            <div className={styles.positions}>
              {dailyWeights &&
                positions.map((position: any, index: number) => {
                  return (
                    <div onClick={() => closeTrade(position.id)} key={index}>
                      <PositionLine
                        amount={position.amount.toString()}
                        positionType={position.positionType}
                        weightSnapshot={position.weightSnapshot / 10}
                        currentWeight={
                          dailyWeights[dailyWeights.length - 1].close
                        }
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/* Right */}
        <div className={styles.rightContainer}>
          {/* Short/Long tabs */}
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
          {/* Slider and input */}
          <div className={styles.sliders}>
            {dailyWeights && weeklyWeights && (
              <>
                {/* Balance */}
                {zhuContractAddress && wallet && (
                  <div className={styles.balance}>Balance : {balance} ZHU</div>
                )}
                {/* Weight text */}
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
                {/* Amount input */}
                <div
                  className={
                    zhuExchangeContractAddress && wallet && !approved
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
                    disabled={approved}
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
                  disabled={!zhuExchangeContractAddress || !wallet || approved}
                  className={styles.amountSlider}
                  value={amount}
                  onChange={(e) => {
                    setLongShortValue(e.target.value);
                  }}
                />
              </>
            )}
          </div>
          {/* Faucet */}
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
    </div>
  );
};

export default Chart;
