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
} from "recharts";
import useSWR from "swr";
import axios from "axios";
import { Weight } from "../../../models/Weight";

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

  const getChartDataByYear = () => {
    let chartData: { [key: string]: (number | string) | undefined }[] = [];
    let weightsByYear: Weight[][] | null = getDataSortedByYear();
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

  const chartData =
    dailyWeights && dailyWeights.length > 0 ? getChartDataByYear() : [];
  const chartData2 = getChartData();

  return (
    <div className={styles.content}>
      <div className={styles.title}>Xian-Wei&apos;s weight</div>
      <ResponsiveContainer width="95%" height="50%">
        <AreaChart width={200} height={200} data={chartData2}>
          <XAxis dataKey="name" domain={["auto", "auto"]} />
          <YAxis domain={["auto", "auto"]} />
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
      <ResponsiveContainer width="95%" height="50%">
        <LineChart width={200} height={200} data={chartData}>
          <XAxis dataKey="name" domain={["auto", "auto"]} />
          <YAxis type="number" domain={["auto", "auto"]} />
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
  );
};

export default Weight;
