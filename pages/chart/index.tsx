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

enum Position {
  Long,
  Short,
}

const Chart = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.Weekly);
  const [position, setPosition] = useState<Position>(Position.Short);
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const {
    data: weeklyWeights,
    error: weeklyError,
    isLoading: weeklyIsLoading,
  }: { data: any; error: any; isLoading: boolean } = useSWR(
    "https://zhuxw.com/weight_weekly.json",
    fetcher
  );
  const {
    data: dailyWeights,
    error: dailyError,
    isLoading: dailyIsLoading,
  }: { data: any; error: any; isLoading: boolean } = useSWR(
    "https://zhuxw.com/weight_daily.json",
    fetcher
  );

  const provider: ethers.providers.Web3Provider | null = useWeb3Provider();
  const chainId: number | null = useWeb3ChainId();

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
          <div className={styles.sliders}>Sliders</div>
          {position == Position.Short ? (
            <div className={styles.shortButton}>Short</div>
          ) : (
            <div className={styles.longButton}>Long</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chart;
