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
  Rectangle,
} from "recharts";
import useSWR from "swr";
import axios from "axios";
import type { Weight } from "../../models/Weight";
import Loader from "../../components/Loader";
import {
  formatDateLongMonth,
  getCurrentMonth,
  getCurrentYear,
  getThisWeekMonday,
} from "../../utils/Date";
import Layout from "../../components/Layout";
import Head from "next/head";
import MetaTags from "../../components/MetaTags";
import BottomNavbar from "../../components/BottomNavbar";

export const siteTitle = "Xian-Wei's weight";

const Weight = () => {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: dailyWeights }: { data: Weight[] } = useSWR(
    "/api/weight-daily",
    fetcher,
  );
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({
    2019: false,
    2020: false,
    2021: false,
    2022: false,
    2023: false,
    2024: false,
    2025: false,
  });
  const [hoveredYear, setHoveredYear] = useState<{ [key: string]: boolean }>({
    2019: false,
    2020: false,
    2021: false,
    2022: false,
    2023: false,
    2024: false,
    2025: false,
  });
  const hoveredYearStrokeWidth = 3;

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

  const getChartDataSeparatedByYear = () => {
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
          2024: weightsByYear[5][i - 1] && weightsByYear[5][i - 1].close,
          2025: weightsByYear[6][i] && weightsByYear[6][i].close,
        };
      } else if (i < 59) {
        chartEntry = {
          name: weightsByYear[1][i].time.substring(5),
          2020: weightsByYear[1][i] && weightsByYear[1][i].close,
          2021: weightsByYear[2][i] && weightsByYear[2][i].close,
          2022: weightsByYear[3][i] && weightsByYear[3][i].close,
          2023: weightsByYear[4][i] && weightsByYear[4][i].close,
          2024: weightsByYear[5][i] && weightsByYear[5][i].close,
          2025: weightsByYear[6][i] && weightsByYear[6][i].close,
        };
      } else {
        chartEntry = {
          name: weightsByYear[1][i].time.substring(5),
          2020: weightsByYear[1][i] && weightsByYear[1][i].close,
          2025: weightsByYear[6][i] && weightsByYear[6][i].close,
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
      case "2025":
        setFilters({ ...filters, 2025: !filters[2025].valueOf() });
        break;
    }
  };

  const hoverYear = (year: string, activate: boolean) => {
    switch (year) {
      case "2019":
        setHoveredYear({ ...hoveredYear, 2019: activate });
        break;
      case "2020":
        setHoveredYear({ ...hoveredYear, 2020: activate });
        break;
      case "2021":
        setHoveredYear({ ...hoveredYear, 2021: activate });
        break;
      case "2022":
        setHoveredYear({ ...hoveredYear, 2022: activate });
        break;
      case "2023":
        setHoveredYear({ ...hoveredYear, 2023: activate });
        break;
      case "2024":
        setHoveredYear({ ...hoveredYear, 2024: activate });
        break;
    }
  };

  const getChartDataUnfiltered = () => {
    if (dailyWeights && dailyWeights.length > 0) {
      const weightCloseArray: {
        [key: string]: (number | string) | undefined;
      }[] = [];

      dailyWeights.forEach(weight => {
        let chartObject = { name: weight.time, weight: weight.close };
        weightCloseArray.push(chartObject);
      });

      return weightCloseArray;
    } else {
      return [];
    }
  };

  const getChartDataForCurrentYear = () => {
    if (dailyWeights && dailyWeights.length > 0) {
      const weightCloseArray: {
        [key: string]: (number | string) | undefined;
      }[] = [];
      const currentYear = dailyWeights[dailyWeights.length - 1].time.substring(
        0,
        4,
      );

      dailyWeights.forEach(weight => {
        if (weight.time.substring(0, 4) == currentYear) {
          let chartObject = { name: weight.time, weight: weight.close };
          weightCloseArray.push(chartObject);
        }
      });

      return weightCloseArray;
    } else {
      return [];
    }
  };

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
        name: formatDateLongMonth(weightsByMonth[i][0].time),
        kilogram: -gainLoss,
      };

      chartData.push(chartEntry);
    }

    return chartData;
  };

  const getGainLossByYear = () => {
    const weightsByYear = getWeightsByYear();
    let chartData: { [key: string]: (number | string) | undefined }[] = [];
    let chartEntry: { [key: string]: (number | string) | undefined };

    for (let i = 0; i < weightsByYear.length; i++) {
      const gainLoss = (
        weightsByYear[i][0].close -
        weightsByYear[i][weightsByYear[i].length - 1].close
      ).toFixed(1);

      chartEntry = {
        name: weightsByYear[i][0].time.substring(0, 4),
        kilogram: -gainLoss,
      };

      chartData.push(chartEntry);
    }

    return chartData;
  };

  const getWeightChangeForWeek = () => {
    const thisMondayDay = getThisWeekMonday(
      new Date(dailyWeights[dailyWeights.length - 1].time),
    ).getDate();

    const mondayWeight = dailyWeights
      .slice()
      .reverse()
      .find(weight => weight.time.substring(8, 10) == thisMondayDay.toString());

    if (mondayWeight) {
      return dailyWeights[dailyWeights.length - 1].close - mondayWeight.close;
    } else {
      return 0;
    }
  };

  const getWeightChangeForMonth = () => {
    const firstDayOfMonth = getCurrentYear() + "-" + getCurrentMonth() + "-01";

    const firstDayOfMonthWeight = dailyWeights
      .slice()
      .reverse()
      .find(weight => weight.time == firstDayOfMonth);

    if (firstDayOfMonthWeight) {
      return (
        dailyWeights[dailyWeights.length - 1].close -
        firstDayOfMonthWeight.close
      );
    } else {
      return 0;
    }
  };

  const chartDataUnfiltered = getChartDataUnfiltered();
  const chartDataForCurrentYear = getChartDataForCurrentYear();
  const chartDataByYear =
    dailyWeights && dailyWeights.length > 0
      ? getChartDataSeparatedByYear()
      : [];
  const gainLossByMonth =
    dailyWeights && dailyWeights.length > 0 ? getGainLossByMonth() : [];
  const gainLossByYear =
    dailyWeights && dailyWeights.length > 0 ? getGainLossByYear() : [];
  const currentWeight =
    dailyWeights && dailyWeights.length > 0
      ? dailyWeights[dailyWeights.length - 1].close
      : 0;
  const weeklyChange =
    dailyWeights && dailyWeights.length > 0 ? getWeightChangeForWeek() : 0;
  const monthlyChange =
    dailyWeights && dailyWeights.length > 0 ? getWeightChangeForMonth() : 0;
  const yearlyChange =
    dailyWeights && dailyWeights.length > 0
      ? getGainLossByYear()[getGainLossByYear().length - 1].kilogram
      : 0;

  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={true}>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "Welcome to Xian-Wei's life tracker page - where every misstep, questionable decision, and triumph are meticulously documented for your entertainment."
          }
          url={"https://zhuxw.com/weight"}
        />
      </Head>
      <BottomNavbar page={"tracker"} />
      <div className={styles.container}>
        <div className={styles.content}>
          {dailyWeights ? (
            <>
              <div className={styles.topInfos}>
                <div className={styles.topInfoItem}>
                  Today
                  <div className={styles.topInfoText}>
                    {currentWeight.toFixed(2)} KG
                  </div>
                </div>
                <div className={styles.topInfoItem}>
                  Weekly change
                  <div className={styles.topInfoText}>
                    {weeklyChange.toFixed(2)} KG
                  </div>
                </div>
                <div className={styles.topInfoItem}>
                  Monthly change
                  <div className={styles.topInfoText}>
                    {monthlyChange.toFixed(2)} KG
                  </div>
                </div>
                <div className={styles.topInfoItem}>
                  Yearly change
                  <div className={styles.topInfoText}>{yearlyChange} KG</div>
                </div>
              </div>

              <div className={styles.block}>
                <div className={styles.blockTitle}>Weight in {getCurrentYear()}</div>
                <ResponsiveContainer
                  className={styles.blockContent}
                  height="100%"
                  width="100%"
                >
                  <AreaChart
                    data={chartDataForCurrentYear}
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
                      stroke="rgb(100, 100, 200)"
                      fill="rgb(80, 80, 160)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.block}>
                <div className={styles.blockTitle}>
                  Weight since September 2019
                </div>
                <ResponsiveContainer
                  className={styles.blockContent}
                  height="100%"
                  width="100%"
                >
                  <AreaChart
                    data={chartDataUnfiltered}
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
                      stroke="rgb(100, 100, 200)"
                      fill="rgb(80, 80, 160)"
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
                      cursor={{ fill: "rgb(35, 35, 70)" }}
                      contentStyle={{
                        backgroundColor: "rgb(20, 20, 40)",
                        borderColor: "rgb(80, 80, 160)",
                      }}
                    />
                    <ReferenceLine y={0} stroke="rgb(100, 100, 200)" />
                    <Bar
                      dataKey="kilogram"
                      fill="rgb(100, 100, 200)"
                      activeBar={<Rectangle fill="rgb(150, 150, 255)" />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.block}>
                <div className={styles.blockTitle}>Yearly weight changes</div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart width={500} height={300} data={gainLossByYear}>
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
                      cursor={{ fill: "rgb(35, 35, 70)" }}
                    />
                    <ReferenceLine y={0} stroke="rgb(100, 100, 200)" />
                    <Bar
                      dataKey="kilogram"
                      fill="rgb(100, 100, 200)"
                      activeBar={<Rectangle fill="rgb(150, 150, 255)" />}
                    />
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
                    <Legend
                      onClick={e => toggleYear(e.dataKey)}
                      onPointerEnter={e => hoverYear(e.dataKey, true)}
                      onPointerLeave={e => hoverYear(e.dataKey, false)}
                    />
                    <Line
                      type="monotone"
                      dataKey="2019"
                      stroke="#FF0000"
                      opacity={hoveredYear[2019] ? 1 : 0.8}
                      dot={false}
                      hide={filters[2019]}
                      strokeWidth={
                        hoveredYear[2019] ? hoveredYearStrokeWidth : 1
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="2020"
                      stroke="#00FF00"
                      opacity={hoveredYear[2020] ? 1 : 0.8}
                      dot={false}
                      hide={filters[2020]}
                      strokeWidth={
                        hoveredYear[2020] ? hoveredYearStrokeWidth : 1
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="2021"
                      stroke="#00FFFF"
                      opacity={hoveredYear[2021] ? 1 : 0.8}
                      dot={false}
                      hide={filters[2021]}
                      strokeWidth={
                        hoveredYear[2021] ? hoveredYearStrokeWidth : 1
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="2022"
                      stroke="#FFFF00"
                      opacity={hoveredYear[2022] ? 1 : 0.8}
                      dot={false}
                      hide={filters[2022]}
                      strokeWidth={
                        hoveredYear[2022] ? hoveredYearStrokeWidth : 1
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="2023"
                      stroke="#FF00FF"
                      opacity={hoveredYear[2023] ? 1 : 0.8}
                      dot={false}
                      hide={filters[2023]}
                      strokeWidth={
                        hoveredYear[2023] ? hoveredYearStrokeWidth : 1
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="2024"
                      stroke="#FFFFFF"
                      opacity={hoveredYear[2024] ? 1 : 0.8}
                      dot={false}
                      hide={filters[2024]}
                      strokeWidth={
                        hoveredYear[2024] ? hoveredYearStrokeWidth : 1
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="2025"
                      stroke="#1111FF"
                      opacity={hoveredYear[2025] ? 1 : 0.8}
                      dot={false}
                      hide={filters[2025]}
                      strokeWidth={
                        hoveredYear[2025] ? hoveredYearStrokeWidth : 1
                      }
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Weight;
