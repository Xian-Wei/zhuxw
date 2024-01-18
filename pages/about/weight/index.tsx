import React, { useState } from "react";
import styles from "./weight.module.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  ReferenceLine,
  Bar,
} from "recharts";
import useSWR from "swr";
import axios from "axios";
import { Weight } from "../../../models/Weight";
import Loader from "../../../components/Loader";

const Weight = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: dailyWeights }: { data: Weight[] } = useSWR(
    "/api/weight-daily",
    fetcher
  );
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({
    2019: false,
    2020: false,
    2021: false,
    2022: false,
    2023: false,
    2024: false,
  });

  const getWeightsByYear = () => {
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

  const getWeightsByMonth = () => {
    if (dailyWeights) {
      let weightsByMonth: Weight[][] = [[]];
      let currentMonth = "09";
      let monthIndex = 0;

      for (let i = 0; i < dailyWeights.length; i++) {
        if (dailyWeights[i].time.substring(5, 7) !== currentMonth) {
          currentMonth = dailyWeights[i].time.substring(5, 7);
          weightsByMonth.push([]);
          monthIndex++;
        }

        weightsByMonth[monthIndex].push(dailyWeights[i]);
      }

      return weightsByMonth;
    } else {
      return [];
    }
  };

  const getChartDataByYear = () => {
    let weightsByYear: Weight[][] | null = getWeightsByYear();
    let chartData: { [key: string]: (number | string) | undefined }[] = [];
    let chartEntry: { [key: string]: (number | string) | undefined };

    for (let i = 0; i < 366; i++) {
      if (i > 59) {
        chartEntry = {
          name: weightsByYear[1][i].time.substring(5),
          2019: i > 243 ? weightsByYear[0][i - 244].close : undefined,
          2020: weightsByYear[1][i] && weightsByYear[1][i].close,
          2021: weightsByYear[2][i - 1] && weightsByYear[2][i - 1].close,
          2022: weightsByYear[3][i - 1] && weightsByYear[3][i - 1].close,
          2023: weightsByYear[4][i - 1] && weightsByYear[4][i - 1].close,
          2024: weightsByYear[5][i] && weightsByYear[5][i].close,
        };
      } else if (i < 59) {
        chartEntry = {
          name: weightsByYear[1][i].time.substring(5),
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

  const toggleYear = (year: string) => {
    switch (year) {
      case "2019":
        setFilters({ ...filters, 2019: !filters[2019].valueOf() });
        break;
      case "2020":
        setFilters({ ...filters, 2020: !filters[2020].valueOf() });
        break;
      case "2021":
        setFilters({ ...filters, 2021: !filters[2021].valueOf() });
        break;
      case "2022":
        setFilters({ ...filters, 2022: !filters[2022].valueOf() });
        break;
      case "2023":
        setFilters({ ...filters, 2023: !filters[2023].valueOf() });
        break;
      case "2024":
        setFilters({ ...filters, 2024: !filters[2024].valueOf() });
        break;
    }
  };

  const getChartData = () => {
    if (dailyWeights && dailyWeights.length > 0) {
      const weightCloseArray: {
        [key: string]: (number | string) | undefined;
      }[] = [];

      dailyWeights.forEach((weight) => {
        let chartObject = { name: weight.time, weight: weight.close };
        weightCloseArray.push(chartObject);
      });

      return weightCloseArray;
    } else {
      return [];
    }
  };

  function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    const monthName = new Date(`${year}-${month}-01`).toLocaleString(
      "default",
      { month: "long" }
    );
    return `${monthName} ${year}`;
  }

  const getGainLossByMonth = () => {
    const weightsByMonth = getWeightsByMonth();
    let chartData: { [key: string]: (number | string) | undefined }[] = [];
    let chartEntry: { [key: string]: (number | string) | undefined };

    for (let i = 0; i < weightsByMonth.length; i++) {
      const gainLoss = (
        weightsByMonth[i][0].close -
        weightsByMonth[i][weightsByMonth[i].length - 1].close
      ).toFixed(1);

      chartEntry = {
        name: formatDate(weightsByMonth[i][0].time),
        kilogram: -gainLoss,
      };

      chartData.push(chartEntry);
    }

    return chartData;
  };

  const chartData = getChartData();
  const chartDataByYear =
    dailyWeights && dailyWeights.length > 0 ? getChartDataByYear() : [];
  const gainLossByMonth =
    dailyWeights && dailyWeights.length > 0 ? getGainLossByMonth() : [];

  return (
    <div className={styles.content}>
      {dailyWeights ? (
        <>
          <div className={styles.block}>
            <div className={styles.blockTitle}>Weight since September 2019</div>
            <ResponsiveContainer
              className={styles.blockContent}
              height="100%"
              width="100%"
            >
              <AreaChart
                data={chartData}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  domain={["auto", "auto"]}
                  tick={false}
                  axisLine={false}
                  height={0}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={false}
                  axisLine={false}
                  width={0}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(20, 20, 40)",
                    borderColor: "rgb(80, 80, 160)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.block}>
            <div className={styles.blockTitle}>Monthly weight changes</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={500} height={300} data={gainLossByMonth}>
                <XAxis
                  dataKey="name"
                  tick={false}
                  axisLine={false}
                  height={0}
                />
                <YAxis tick={true} axisLine={true} width={20} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(20, 20, 40)",
                    borderColor: "rgb(80, 80, 160)",
                  }}
                />
                <ReferenceLine y={0} stroke="#FFF" />
                <Bar dataKey="kilogram" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.block}>
            <div className={styles.blockTitle}>Weight by year</div>
            <ResponsiveContainer
              className={styles.blockContent}
              height="100%"
              width="100%"
            >
              <LineChart
                data={chartDataByYear}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  domain={["auto", "auto"]}
                  tick={false}
                  axisLine={false}
                  height={0}
                />
                <YAxis
                  type="number"
                  domain={["auto", "auto"]}
                  tick={false}
                  axisLine={false}
                  width={0}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(20, 20, 40)",
                    borderColor: "rgb(80, 80, 160)",
                  }}
                />
                <Legend onClick={(e) => toggleYear(e.dataKey)} />

                <Line
                  type="monotone"
                  dataKey="2019"
                  stroke="#FF0000"
                  dot={false}
                  hide={filters[2019]}
                />

                <Line
                  type="monotone"
                  dataKey="2020"
                  stroke="#00FF00"
                  dot={false}
                  hide={filters[2020]}
                />

                <Line
                  type="monotone"
                  dataKey="2021"
                  stroke="#00FFFF"
                  dot={false}
                  hide={filters[2021]}
                />

                <Line
                  type="monotone"
                  dataKey="2022"
                  stroke="#FFFF00"
                  dot={false}
                  hide={filters[2022]}
                />

                <Line
                  type="monotone"
                  dataKey="2023"
                  stroke="#FF00FF"
                  dot={false}
                  hide={filters[2023]}
                />

                <Line
                  type="monotone"
                  dataKey="2024"
                  stroke="#8888FF"
                  dot={false}
                  hide={filters[2024]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Weight;
