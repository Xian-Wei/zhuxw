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

  const toggleYear = (year: string) =>
    setFilters(f => ({ ...f, [year]: !f[year] }));

  const hoverYear = (year: string, activate: boolean) =>
    setHoveredYear(h => ({ ...h, [year]: activate }));

  const chartDataUnfiltered = useMemo(() => {
    if (!dailyWeights || dailyWeights.length === 0) return [];
    return dailyWeights.map(w => ({ name: w.time, weight: w.close }));
  }, [dailyWeights]);

  const chartDataForCurrentYear = useMemo(() => {
    if (!dailyWeights || dailyWeights.length === 0) return [];
    const currentYear = dailyWeights[dailyWeights.length - 1].time.substring(0, 4);
    return dailyWeights
      .filter(w => w.time.substring(0, 4) === currentYear)
      .map(w => ({ name: w.time, weight: w.close }));
  }, [dailyWeights]);

  const weightsByYear = useMemo(() => {
    if (!dailyWeights || dailyWeights.length === 0) return [];
    const result: Weight[][] = [[]];
    let currentYear = dailyWeights[0].time.substring(0, 4);
    let idx = 0;
    for (const w of dailyWeights) {
      if (w.time.substring(0, 4) !== currentYear) {
        currentYear = w.time.substring(0, 4);
        result.push([]);
        idx++;
      }
      result[idx].push(w);
    }
    return result;
  }, [dailyWeights]);

  const weightsByMonth = useMemo(() => {
    if (!dailyWeights || dailyWeights.length === 0) return [];
    const result: Weight[][] = [[]];
    let currentMonth = dailyWeights[0].time.substring(5, 7);
    let idx = 0;
    for (const w of dailyWeights) {
      if (w.time.substring(5, 7) !== currentMonth) {
        currentMonth = w.time.substring(5, 7);
        result.push([]);
        idx++;
      }
      result[idx].push(w);
    }
    return result;
  }, [dailyWeights]);

  const gainLossByMonth = useMemo(() => {
    if (weightsByMonth.length === 0) return [];
    return weightsByMonth.map(monthWeights => ({
      name: formatDateLongMonth(monthWeights[0].time),
      kilogram: -(monthWeights[0].close - monthWeights[monthWeights.length - 1].close).toFixed(1) as unknown as number,
    }));
  }, [weightsByMonth]);

  const gainLossByYear = useMemo(() => {
    if (weightsByYear.length === 0) return [];
    return weightsByYear.map(yearWeights => ({
      name: yearWeights[0].time.substring(0, 4),
      kilogram: -(yearWeights[0].close - yearWeights[yearWeights.length - 1].close).toFixed(1) as unknown as number,
    }));
  }, [weightsByYear]);

  const chartDataByYear = useMemo(() => {
    if (!dailyWeights || dailyWeights.length === 0 || years.length === 0) return [];
    const yearDayMap: { [year: string]: { [day: number]: number } } = {};
    dailyWeights.forEach(w => {
      const year = w.time.substring(0, 4);
      const date = new Date(w.time);
      const dayOfYear = Math.floor(
        (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
      );
      if (!yearDayMap[year]) yearDayMap[year] = {};
      yearDayMap[year][dayOfYear] = w.close;
    });
    return Array.from({ length: 366 }, (_, i) => {
      const label = new Date(2020, 0, i).toISOString().substring(5, 10);
      const entry: { [key: string]: number | string | undefined } = { name: label };
      years.forEach(year => { entry[year] = yearDayMap[year]?.[i]; });
      return entry;
    });
  }, [dailyWeights, years]);

  const currentWeight = useMemo(() =>
    dailyWeights && dailyWeights.length > 0 ? dailyWeights[dailyWeights.length - 1].close : 0,
  [dailyWeights]);

  const weeklyChange = useMemo(() => {
    if (!dailyWeights || dailyWeights.length === 0) return 0;
    const thisMondayDay = getThisWeekMonday(
      new Date(dailyWeights[dailyWeights.length - 1].time),
    ).getDate();
    const mondayWeight = dailyWeights
      .slice()
      .reverse()
      .find(w => w.time.substring(8, 10) === thisMondayDay.toString());
    return mondayWeight ? dailyWeights[dailyWeights.length - 1].close - mondayWeight.close : 0;
  }, [dailyWeights]);

  const monthlyChange = useMemo(() => {
    if (!dailyWeights || dailyWeights.length === 0) return 0;
    const firstDayOfMonth = getCurrentYear() + "-" + getCurrentMonth() + "-01";
    const firstDayWeight = dailyWeights.slice().reverse().find(w => w.time === firstDayOfMonth);
    return firstDayWeight ? dailyWeights[dailyWeights.length - 1].close - firstDayWeight.close : 0;
  }, [dailyWeights]);

  const yearlyChange = gainLossByYear.length > 0 ? gainLossByYear[gainLossByYear.length - 1].kilogram : 0;

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
