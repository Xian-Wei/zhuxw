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
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: workouts }: { data: WorkoutItem[] } = useSWR(
    "/api/workout",
    fetcher
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
      { month: "long" }
    );
    return `${monthName} ${year}`;
  }

  const getChartDataWithGymSort = () => {
    const workouts: WorkoutItem[][] = getWorkoutsByMonth();
    let chartData: { [key: string]: (number | string) | undefined }[] = [];

    for (let i = 0; i < workouts.length; i++) {
      let gym = 0;
      let notGym = 0;
      workouts[i].forEach((workout) => {
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

  useEffect(() => {
    if (workouts) {
      const yes = getChartDataWithGymSort();
      console.log(yes);
    }
  }, [workouts]);

  const workoutsPerMonth =
    workouts && workouts.length > 0 ? getChartDataWithGymSort() : [];

  return (
    <>
      <div className={styles.content}>
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
