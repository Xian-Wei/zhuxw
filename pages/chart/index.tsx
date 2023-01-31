import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import LWChart from "../../components/LWChart";
import { Timeframe } from "../../models/Timeframe";
import styles from "./chart.module.scss";

enum Position {
  Long,
  Short,
}

const Chart = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.Weekly);

  const [position, setPosition] = useState(Position.Short);

  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={false}>
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
          <div className={styles.valueInput}>Yes</div>
        </div>
      </div>
    </Layout>
  );
};

export default Chart;
