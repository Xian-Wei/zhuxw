import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import LWChart from "../../components/LWChart";
import styles from "./chart.module.scss";
import weeklyWeightData from "../../json/weight_weekly.json";
import dailyWeightData from "../../json/weight_daily.json";
import WeightData from "../../models/WeightData";

enum Position {
  Long,
  Short,
}

enum Timeframe {
  Daily,
  Weekly,
}

export default function Chart() {
  const [weights, setWeights] = useState<WeightData[] | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.Weekly);
  const [longValue, setLongValue] = useState<number>(0);
  const [shortValue, setShortValue] = useState<number>(0);
  const weeklyWeights: WeightData[] = weeklyWeightData;
  const dailyWeights: WeightData[] = dailyWeightData;

  const setValue = (value: number, position: Position) => {
    if (position == Position.Long && !isNaN(value)) {
      setLongValue(value);
    } else if (position == Position.Long && isNaN(value)) {
      setLongValue(0);
    } else if (position == Position.Short && !isNaN(value)) {
      setShortValue(value);
    } else if (position == Position.Short && isNaN(value)) {
      setShortValue(0);
    }
  };

  const setWeightsByTime = () => {
    setWeights(timeframe == Timeframe.Weekly ? weeklyWeights : dailyWeights);
  };

  const long = () => {
    console.log(longValue);
  };

  const short = () => {
    console.log(shortValue);
  };

  useEffect(() => {
    setWeightsByTime();
  }, []);

  useEffect(() => {
    setWeightsByTime();
  }, [timeframe]);

  return (
    <Layout>
      {weights != null && (
        <div className={styles.container}>
          <div className={styles.topContainer}>
            <div className={styles.infoContainer}>
              <div className={styles.pair}>XWZ/KG</div>
              <div className={styles.price}>
                {weights[weights.length - 1].close} KG
              </div>
              <div className={styles.priceContainer}>
                <div className={styles.priceLabel}>24h change</div>
                <div className={styles.priceChange}>
                  {(
                    weights[weights.length - 1].close -
                    weights[weights.length - 2].close
                  ).toPrecision(2)}{" "}
                  KG /{" "}
                  {(
                    ((weights[weights.length - 1].close -
                      weights[weights.length - 2].close) /
                      weights[weights.length - 1].close) *
                    100
                  ).toPrecision(2)}
                  %
                </div>
              </div>
              <div className={styles.priceContainer}>
                <div className={styles.priceLabel}>24h high</div>
                <div className={styles.priceHigh}>
                  {weights[weights.length - 1].high} KG
                </div>
              </div>
              <div className={styles.priceContainer}>
                <div className={styles.priceLabel}>24h low</div>
                <div className={styles.priceLow}>
                  {weights[weights.length - 1].low} KG
                </div>
              </div>
              <div
                className={styles.timeframeButton}
                onClick={() =>
                  setTimeframe(
                    timeframe == Timeframe.Daily
                      ? Timeframe.Weekly
                      : Timeframe.Daily
                  )
                }
              >
                {timeframe == Timeframe.Daily ? "1D" : "1W"}
              </div>
            </div>
          </div>
          <div className={styles.centerContainer}>
            <div className={styles.centerLeftContainer}>
              <LWChart weights={weights} />
            </div>
            <div className={styles.centerRightContainer}>Order book</div>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.bettingContainer}>
              <div className={styles.valueInputContainer}>
                <input
                  type="number"
                  className={styles.valueInput}
                  step="0.01"
                  min="0"
                  value={longValue}
                  onChange={(e) =>
                    setValue(e.target.valueAsNumber, Position.Long)
                  }
                />
                <div className={styles.valueCurrency}>ETH</div>
              </div>
              <div className={styles.longButton} onClick={long}>
                Long
              </div>
            </div>
            <div className={styles.bettingContainer}>
              <div className={styles.valueInputContainer}>
                <input
                  type="number"
                  className={styles.valueInput}
                  step="0.01"
                  min="0"
                  value={shortValue}
                  onChange={(e) =>
                    setValue(e.target.valueAsNumber, Position.Short)
                  }
                />
                <div className={styles.valueCurrency}>ETH</div>
              </div>
              <div className={styles.shortButton} onClick={short}>
                Short
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
