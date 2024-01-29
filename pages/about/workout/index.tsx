import React, { useEffect } from "react";
import styles from "./workout.module.scss";
import useSWR from "swr";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useIsWidth from "../../../hooks/useIsWidth";
import { WindowWidth } from "../../../models/WindowWidth";
import { WorkoutItem } from "../../../models/WorkoutItem";

const Workout = () => {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: workouts }: { data: WorkoutItem[] } = useSWR(
    "/api/workout",
    fetcher,
  );
  const isWidth = useIsWidth(WindowWidth.md);

  const getWorkoutsByMonth = () => {
    let allWorkoutsCounts: WorkoutItem[][] = [[]];
    let currentMonth = "09";
    let monthIndex = 0;

    for (let i = 0; i < workouts.length; i++) {
      if (workouts[i].date.substring(5, 7) !== currentMonth) {
        currentMonth = workouts[i].date.substring(5, 7);
        allWorkoutsCounts.push([]);
        monthIndex++;
      }

      allWorkoutsCounts[monthIndex].push(workouts[i]);
    }

    return allWorkoutsCounts;
  };

  const getWorkoutsByYear = () => {
    let allWorkoutsCounts: WorkoutItem[][] = [[]];
    let currentYear = "2019";
    let yearIndex = 0;

    for (let i = 0; i < workouts.length; i++) {
      if (workouts[i].date.substring(0, 4) !== currentYear) {
        currentYear = workouts[i].date.substring(0, 4);
        allWorkoutsCounts.push([]);
        yearIndex++;
      }

      allWorkoutsCounts[yearIndex].push(workouts[i]);
    }

    return allWorkoutsCounts;
  };

  function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    const monthName = new Date(`${year}-${month}-01`).toLocaleString(
      "default",
      { month: "long" },
    );
    return `${monthName} ${year}`;
  }

  const getChartDataWithGymSort = (
    workouts: WorkoutItem[][],
    dateFormatWithMonth: boolean,
  ) => {
    let chartData: { [key: string]: (number | string) | undefined }[] = [];

    for (let i = 0; i < workouts.length; i++) {
      let gym = 0;
      let notGym = 0;
      workouts[i].forEach(workout => {
        if (workout.gym) {
          gym++;
        } else {
          notGym++;
        }
      });

      chartData.push({
        name: dateFormatWithMonth
          ? formatDate(workouts[i][0].date)
          : workouts[i][0].date.substring(0, 4),
        gym: gym,
        home: notGym,
      });
    }

    return chartData;
  };

  function getCurrentMonth(): string {
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth() + 1;
    const formattedMonth = monthIndex.toString().padStart(2, "0");
    return formattedMonth;
  }

  function getThisWeekMonday(currentDate: Date): Date {
    const currentDay = currentDate.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

    const mondayDate = new Date(currentDate);
    mondayDate.setDate(currentDate.getDate() - daysSinceMonday);

    return mondayDate;
  }

  const getWorkoutCountForWeek = () => {
    const thisMondayDay = getThisWeekMonday(new Date()).getDate();
    const currentMonth = getCurrentMonth();
    let workoutCount = 0;

    if (workouts) {
      for (let i = workouts.length - 1; i > workouts.length - 7; i--) {
        if (
          Number(workouts[i].date.substring(8, 10)) >= thisMondayDay &&
          workouts[i].date.substring(5, 7) == currentMonth
        ) {
          workoutCount++;
        }
      }
      return workoutCount;
    } else return 0;
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

  const countMuscles = (
    threshold: number,
  ): {
    name: string;
    value: number;
  }[] => {
    const muscleCount: { [key: string]: number } = {};

    workouts.forEach((workout: WorkoutItem) => {
      const muscles = workout.muscle.split(" & ");

      muscles.forEach((muscle: string) => {
        muscleCount[muscle] = (muscleCount[muscle] || 0) + 1;
      });
    });

    const result: {
      name: string;
      value: number;
    }[] = Object.entries(muscleCount)
      .filter(([name, value]) => value >= threshold)
      .map(([name, value]) => ({
        name,
        value,
      }));

    const othersCount = Object.entries(muscleCount)
      .filter(([name, value]) => value < threshold)
      .reduce((sum, [, value]) => sum + value, 0);

    if (othersCount > 0) {
      result.push({ name: "Others", value: othersCount });
    }

    return result;
  };

  function formatDateAgo(inputDate: string): string {
    const currentDate = new Date();
    const inputDateObject = new Date(inputDate);

    const timeDifference = currentDate.getTime() - inputDateObject.getTime();

    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) {
      return "Today";
    } else if (daysAgo === 1) {
      return "1 day ago";
    } else {
      return `${daysAgo} days ago`;
    }
  }

  const workoutsPerMonth =
    workouts && workouts.length > 0
      ? getChartDataWithGymSort(getWorkoutsByMonth(), true)
      : [];
  const workoutsPerYear =
    workouts && workouts.length > 0
      ? getChartDataWithGymSort(getWorkoutsByYear(), false)
      : [];
  const lastWorkout =
    workouts && workouts.length > 0
      ? formatDateAgo(workouts[workouts.length - 1].date)
      : "None";
  const lastMuscleWorked =
    workouts && workouts.length > 0
      ? workouts[workouts.length - 1].muscle
      : "None";
  const workoutCountsForWeek =
    workouts && workouts.length > 0 ? getWorkoutCountForWeek() : 0;
  const workoutCountsForMonth =
    workouts && workouts.length > 0 ? getWorkoutCountForMonth() : 0;
  const musclePieData = workouts && workouts ? countMuscles(10) : [];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF0000",
    "#36a2eb",
    "#4bc0c0",
    "#9966CC",
    "#FFD700",
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active) {
      return (
        <div
          style={{
            backgroundColor: "rgb(20, 20, 40)",
            padding: "10px",
            border: "1px solid rgb(80, 80, 160)",
          }}
        >
          <p>
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className={styles.content}>
        <div className={styles.topInfos}>
          <div className={styles.topInfoItem}>
            Last workout
            <div className={styles.topInfoText}>{lastWorkout}</div>
          </div>
          <div className={styles.topInfoItem}>
            Muscle worked
            <div className={styles.topInfoText}>{lastMuscleWorked}</div>
          </div>
          <div className={styles.topInfoItem}>
            Sessions this week
            <div className={styles.topInfoText}>{workoutCountsForWeek}</div>
          </div>
          <div className={styles.topInfoItem}>
            Sessions this month
            <div className={styles.topInfoText}>{workoutCountsForMonth}</div>
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.blockTitle}>Workouts per month</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={500} height={300} data={workoutsPerMonth}>
              <XAxis dataKey="name" tick={false} axisLine={false} height={0} />
              <YAxis tick={false} axisLine={false} width={0} />
              <Tooltip
                cursor={{ fill: "rgb(35, 35, 70)" }}
                contentStyle={{
                  backgroundColor: "rgb(20, 20, 40)",
                  borderColor: "rgb(80, 80, 160)",
                }}
              />
              <Legend />
              <Bar dataKey="gym" fill="#8884d8" />
              <Bar dataKey="home" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.block}>
          <div className={styles.blockTitle}>Workouts per year</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={500} height={300} data={workoutsPerYear}>
              <XAxis dataKey="name" tick={false} axisLine={false} height={0} />
              <YAxis tick={false} axisLine={false} width={0} />
              <Tooltip
                cursor={{ fill: "rgb(35, 35, 70)" }}
                contentStyle={{
                  backgroundColor: "rgb(20, 20, 40)",
                  borderColor: "rgb(80, 80, 160)",
                }}
              />
              <Legend />
              <Bar dataKey="gym" fill="#8884d8" />
              <Bar dataKey="home" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.biggerBlock}>
          <div className={styles.blockTitle}>Muscle activity trends</div>
          <ResponsiveContainer>
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={musclePieData}
                outerRadius={isWidth ? 170 : 100}
                fill="#8884d8"
                label
              >
                {musclePieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout={isWidth ? "vertical" : "horizontal"}
                verticalAlign={isWidth ? "top" : "bottom"}
                align={isWidth ? "right" : "center"}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Workout;
