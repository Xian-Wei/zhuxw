"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import BottomNavbar from "../../components/BottomNavbar";

const WeightPage = () => {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: dailyWeights }: { data: Weight[] } = useSWR(
    "/api/weight-daily",
    fetcher,
  );
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({});
  const [hoveredYear, setHoveredYear] = useState<{ [key: string]: boolean }>({});
  const hoveredYearStrokeWidth = 3;

  const YEAR_COLORS: { [year: string]: string } = {
    "2019": "#FF6B6B",
    "2020": "#69DB7C",
    "2021": "#74C0FC",
    "2022": "#FFD43B",
    "2023": "#DA77F2",
    "2024": "#A9B7C6",
    "2025": "#4DABF7",
  };
  const COLOR_PALETTE = Object.values(YEAR_COLORS);
  const getYearColor = (year: string, idx: number) =>
    YEAR_COLORS[year] ?? COLOR_PALETTE[idx % COLOR_PALETTE.length];

  const years = useMemo(() => {
    if (!dailyWeights) return [];
    return [...new Set(dailyWeights.map(w => w.time.substring(0, 4)))].sort();
  }, [dailyWeights]);

  useEffect(() => {
    if (years.length > 0) {
      setFilters(Object.fromEntries(years.map(y => [y, false])));
      setHoveredYear(Object.fromEntries(years.map(y => [y, false])));
    }
  }, [years]);

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
    if (!dailyWeights || dailyWeights.length === 0) return [];

    const yearDayMap: { [year: string]: { [day: number]: number } } = {};
    dailyWeights.forEach(weight => {
      const year = weight.time.substring(0, 4);
      const date = new Date(weight.time);
      const dayOfYear = Math.floor(
        (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
      );
      if (!yearDayMap[year]) yearDayMap[year] = {};
      yearDayMap[year][dayOfYear] = weight.close;
    });

    return Array.from({ length: 366 }, (_, i) => {
      const refDate = new Date(2020, 0, i);
      const label = refDate.toISOString().substring(5, 10);
      const entry: { [key: string]: number | string | undefined } = { name: label };
      years.forEach(year => { entry[year] = yearDayMap[year]?.[i]; });
      return entry;
    });
  };

  const toggleYear = (year: string) =>
    setFilters(f => ({ ...f, [year]: !f[year] }));

  const hoverYear = (year: string, activate: boolean) =>
    setHoveredYear(h => ({ ...h, [year]: activate }));

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
                <div className={styles.chartWrapper}>
                <ResponsiveContainer height="100%" width="100%">
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
              </div>
              <div className={styles.block}>
                <div className={styles.blockTitle}>
                  Weight since September 2019
                </div>
                <div className={styles.chartWrapper}>
                <ResponsiveContainer height="100%" width="100%">
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
              </div>
              <div className={styles.block}>
                <div className={styles.blockTitle}>Monthly weight changes</div>
                <div className={styles.chartWrapper}>
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
              </div>
              <div className={styles.block}>
                <div className={styles.blockTitle}>Yearly weight changes</div>
                <div className={styles.chartWrapper}>
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
              </div>
              <div className={styles.block}>
                <div className={styles.blockTitle}>Weight by year</div>
                <div className={styles.chartWrapper}>
                <ResponsiveContainer height="100%" width="100%">
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
                      onClick={e => toggleYear(e.dataKey as string)}
                      onPointerEnter={e => hoverYear(e.dataKey as string, true)}
                      onPointerLeave={e => hoverYear(e.dataKey as string, false)}
                    />
                    {years.map((year, idx) => (
                      <Line
                        key={year}
                        type="monotone"
                        dataKey={year}
                        stroke={getYearColor(year, idx)}
                        opacity={hoveredYear[year] ? 1 : 0.8}
                        dot={false}
                        hide={filters[year]}
                        strokeWidth={hoveredYear[year] ? hoveredYearStrokeWidth : 1}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                </div>
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

export default WeightPage;
