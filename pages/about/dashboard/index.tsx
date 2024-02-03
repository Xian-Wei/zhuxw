import React from "react";
import styles from "./dashboard.module.scss";
import axios from "axios";
import { Weight } from "../../../models/Weight";
import useSWR from "swr";
import { WorkoutItem } from "../../../models/WorkoutItem";
import { formatDateAgo, getCurrentMonth } from "../../../utils/Date";
import useIsMetamaskInstalled from "../../../hooks/useIsMetamaskInstalled";
import LoadingAnimation from "../../../components/LoadingAnimation";

const Dashboard = () => {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: dailyWeights }: { data: Weight[] } = useSWR(
    "/api/weight-daily",
    fetcher,
  );
  const { data: workouts }: { data: WorkoutItem[] } = useSWR(
    "/api/workout",
    fetcher,
  );
  const isMetamaskInstalled = useIsMetamaskInstalled();

  const getWeightTrend = (days: number) => {
    const weightDifference =
      dailyWeights[dailyWeights.length - 1].close -
      dailyWeights[dailyWeights.length - days - 1].close;

    if (weightDifference < 0) {
      return isMetamaskInstalled ? "Bearish" : "Optimistic";
    } else if (weightDifference > 0) {
      return isMetamaskInstalled ? "Bullish" : "Pessimistic";
    } else {
      return "Neutral";
    }
  };

  const getWorkoutCountForMonth = () => {
    const currentMonth = getCurrentMonth();
    let workoutCount = 0;

    if (workouts) {
      for (let i = workouts.length - 1; i > workouts.length - 30; i--) {
        if (workouts[i].date.substring(5, 7) == currentMonth) {
          workoutCount++;
        }
      }
      return workoutCount;
    } else return 0;
  };

  const todayWeight = dailyWeights
    ? dailyWeights[dailyWeights.length - 1].close
    : 0;
  const weightTrend = dailyWeights ? getWeightTrend(14) : "Neutral";
  const lastWorkout =
    workouts && workouts.length > 0
      ? formatDateAgo(workouts[workouts.length - 1].date)
      : "None";
  const workoutCountsForMonth =
    workouts && workouts.length > 0 ? getWorkoutCountForMonth() : 0;

  return (
    <div className={styles.content}>
      <div className={styles.topInfos}>
        <div className={styles.topInfoItem}>
          Today&apos;s weight
          <div className={styles.topInfoText}>
            {dailyWeights ? `${todayWeight} KG` : <LoadingAnimation />}
          </div>
        </div>
        <div className={styles.topInfoItem}>
          Weight trend
          <div className={styles.topInfoText}>
            {dailyWeights ? weightTrend : <LoadingAnimation />}
          </div>
        </div>
        <div className={styles.topInfoItem}>
          Last workout
          <div className={styles.topInfoText}>
            {workouts ? lastWorkout : <LoadingAnimation />}
          </div>
        </div>
        <div className={styles.topInfoItem}>
          Workouts (month)
          <div className={styles.topInfoText}>
            {workouts ? workoutCountsForMonth : <LoadingAnimation />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
