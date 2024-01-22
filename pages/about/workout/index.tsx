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
} from "recharts";

interface WorkoutItem {
  muscle: string;
  gym: boolean;
  date: string;
}

const Workout = () => {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: workouts }: { data: WorkoutItem[] } = useSWR(
    "/api/workout",
    fetcher,
  );

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

  function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    const monthName = new Date(`${year}-${month}-01`).toLocaleString(
      "default",
      { month: "long" },
    );
    return `${monthName} ${year}`;
  }

  const getChartDataWithGymSort = () => {
    const workouts: WorkoutItem[][] = getWorkoutsByMonth();
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
        name: formatDate(workouts[i][0].date),
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

  // const incrementMonth = (month: string) => {
  //   if (month === "12") {
  //     return "01";
  //   } else {
  //     const nextMonth = parseInt(month) + 1;
  //     return nextMonth.toString().padStart(2, "0");
  //   }
  // };

  // const getSumOfMonthlyWorkoutsPerYear = () => {
  //   if (workouts) {
  //     let allWorkoutsCounts: number[][] = [[]];
  //     let currentMonth = "01";
  //     let currentYear = "2019";
  //     let currentYearIndex = 0;
  //     let workoutCountForMonth = 0;

  //     for (let i = 0; i < workouts.length; i++) {
  //       if (workouts[i].date.substring(5, 7) == currentMonth) {
  //         workoutCountForMonth++;
  //       } else {
  //         allWorkoutsCounts[currentYearIndex].push(workoutCountForMonth);
  //         workoutCountForMonth = 1;
  //         currentMonth = incrementMonth(currentMonth);

  //         if (currentMonth != workouts[i].date.substring(5, 7)) {
  //           workoutCountForMonth = 0;
  //         }
  //       }

  //       if (currentYear != workouts[i].date.substring(0, 4)) {
  //         currentYear = workouts[i].date.substring(0, 4);
  //         allWorkoutsCounts.push([]);
  //         currentYearIndex++;
  //       }
  //     }
  //     allWorkoutsCounts[currentYearIndex].push(workoutCountForMonth);

  //     return allWorkoutsCounts;
  //   }
  // };

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
    workouts && workouts.length > 0 ? getChartDataWithGymSort() : [];
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
      </div>
    </>
  );
};

export default Workout;
