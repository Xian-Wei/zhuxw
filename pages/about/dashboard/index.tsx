import React from "react";
import styles from "./dashboard.module.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useSWR from "swr";
import axios from "axios";
import { Weight } from "../../../models/Weight";

const Dashboard = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: dailyWeights }: { data: Weight[] } = useSWR(
    "/api/weight-daily",
    fetcher
  );

  const getDataSortedByYear = () => {
    if (dailyWeights) {
      let weightsByYear: Weight[][] = [[]];
      let currentYear = "2019";
      let yearIndex = 0;

      for (let i = 0; i < dailyWeights.length; i++) {
        if (dailyWeights[i].time.substring(0, 4) !== currentYear) {
          currentYear = dailyWeights[i].time.substring(0, 4);
          weightsByYear.push([]);
          yearIndex++;
        }

        weightsByYear[yearIndex].push(dailyWeights[i]);
      }

      return weightsByYear;
    } else {
      return [];
    }
  };

  const getChartData = () => {
    let chartData: { [key: string]: number | string }[] = [];
    let weightsByYear: Weight[][] | null = getDataSortedByYear();
    let chartEntry: { [key: string]: number | string };

    for (let i = 0; i < 366; i++) {
      if (i > 59) {
        chartEntry = {
          name: weightsByYear[1][i].time.substring(5),
          2019: weightsByYear[0][i - 1] && weightsByYear[0][i - 1].close,
          2020: weightsByYear[1][i] && weightsByYear[1][i].close,
          2021: weightsByYear[2][i - 1] && weightsByYear[2][i - 1].close,
          2022: weightsByYear[3][i - 1] && weightsByYear[3][i - 1].close,
          2023: weightsByYear[4][i - 1] && weightsByYear[4][i - 1].close,
          2024: weightsByYear[5][i] && weightsByYear[5][i].close,
        };
      } else if (i < 59) {
        chartEntry = {
          name: weightsByYear[1][i].time.substring(5),
          2019: weightsByYear[0][i] && weightsByYear[0][i].close,
          2020: weightsByYear[1][i] && weightsByYear[1][i].close,
          2021: weightsByYear[2][i] && weightsByYear[2][i].close,
          2022: weightsByYear[3][i] && weightsByYear[3][i].close,
          2023: weightsByYear[4][i] && weightsByYear[4][i].close,
          2024: weightsByYear[5][i] && weightsByYear[5][i].close,
        };
      } else {
        chartEntry = {
          name: weightsByYear[1][i].time.substring(5),
          2020: weightsByYear[1][i] && weightsByYear[1][i].close,
          2024: weightsByYear[5][i] && weightsByYear[5][i].close,
        };
      }

      chartData.push(chartEntry);
    }

    return chartData;
  };

  const chartData =
    dailyWeights && dailyWeights.length > 0 ? getChartData() : [];

  return (
    <div className={styles.weightChart}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={chartData}>
          <XAxis dataKey="name" domain={["auto", "auto"]} />
          <YAxis type="number" domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgb(10, 10, 20)",
              borderColor: "rgb(80, 80, 160)",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="2019" stroke="#FF0000" dot={false} />
          <Line type="monotone" dataKey="2020" stroke="#00FF00" dot={false} />
          <Line type="monotone" dataKey="2021" stroke="#0000FF" dot={false} />
          <Line type="monotone" dataKey="2022" stroke="#FFFF00" dot={false} />
          <Line type="monotone" dataKey="2023" stroke="#FF00FF" dot={false} />
          <Line type="monotone" dataKey="2024" stroke="#00FFFF" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
