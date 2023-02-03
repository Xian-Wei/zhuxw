import Head from "next/head";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import LWChart from "../../components/LWChart";
import { Timeframe } from "../../models/Timeframe";
import styles from "./chart.module.scss";
import weeklyWeightData from "../../json/weight_weekly.json";
import dailyWeightData from "../../json/weight_daily.json";

enum Position {
  Long,
  Short,
}

const Chart = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.Weekly);
  const [position, setPosition] = useState(Position.Short);

  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={false}>
      <Head>
        <title>
          {(timeframe == Timeframe.Daily
            ? dailyWeightData.reverse()[0].close
            : weeklyWeightData.reverse()[0].close
          ).toString() + " KG | XWZ/KG"}
        </title>
        <meta
          name="og:title"
          content={
            (timeframe == Timeframe.Daily
              ? dailyWeightData.reverse()[0].close
              : weeklyWeightData.reverse()[0].close
            ).toString() + " KG | XWZ/KG"
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

            <LWChart timeframe={timeframe} />
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
