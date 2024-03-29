import React from "react";

import { percentageDifference } from "../../../utils/ChartUtils";
import styles from "./positionline.module.scss";

interface PositionLineProps {
  amount: string;
  positionType: number;
  weightSnapshot: number;
  currentWeight: number;
}

const PositionLine = ({
  amount,
  positionType,
  weightSnapshot,
  currentWeight,
}: PositionLineProps) => {
  const PNL = () => {
    // Neutral percentage
    if (percentageDifference(weightSnapshot, currentWeight) == 0) {
      return <div className={styles.positionPNL}>0%</div>;
    }
    // Negative percentage
    else if (percentageDifference(weightSnapshot, currentWeight) < 0) {
      // Short
      if (positionType == 0) {
        return (
          <div className={styles.positionPNLGain}>
            +
            {(
              -percentageDifference(weightSnapshot, currentWeight) * 20
            ).toFixed(2)}
            %
          </div>
        );
      }
      // Long
      else {
        return (
          <div className={styles.positionPNLLoss}>
            {(percentageDifference(weightSnapshot, currentWeight) * 20).toFixed(
              2,
            )}
            %
          </div>
        );
      }
    }
    // Positive percentage
    else {
      // Short
      if (positionType == 0) {
        return (
          <div className={styles.positionPNLLoss}>
            {(
              -percentageDifference(weightSnapshot, currentWeight) * 20
            ).toFixed(2)}
            %
          </div>
        );
      }
      // Long
      else {
        return (
          <div className={styles.positionPNLGain}>
            +
            {(percentageDifference(weightSnapshot, currentWeight) * 20).toFixed(
              2,
            )}
            %
          </div>
        );
      }
    }
  };

  return (
    <div className={styles.line}>
      <div
        className={
          positionType == 0
            ? styles.positionSymbolShort
            : styles.positionSymbolLong
        }
      >
        ZHU/KG
      </div>
      <div className={styles.positionSize}>{amount} ZHU</div>
      <div className={styles.positionEntryPrice}>{weightSnapshot} KG</div>
      <div className={styles.positionLiquidationPrice}>
        {positionType == 0
          ? `${(weightSnapshot + weightSnapshot / 20).toFixed(1)} KG`
          : `${(weightSnapshot - weightSnapshot / 20).toFixed(1)} KG`}
      </div>
      <PNL />
    </div>
  );
};

export default PositionLine;
