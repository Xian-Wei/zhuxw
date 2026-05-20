import { useEffect, useRef } from "react";
import { Timeframe } from "../../../models/Timeframe";
import { IChartApi, ISeriesApi, CandlestickSeries } from "lightweight-charts";
import styles from "./lwchart.module.scss";

interface ChartProps {
  weeklyWeights: any;
  dailyWeights: any;
  timeframe: Timeframe;
}

const backgroundColor = "#FFFFFF00";
const textColor = "white";
const gridColor = "#6e6e6e1a";
const borderColor = "#FFFFFF00";
const crosshairColor = "#ffffff4f";
const labelBackgroundColor = "#6464c8";

const LWChart = ({ weeklyWeights, dailyWeights, timeframe }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // Initialize chart once
  useEffect(() => {
    if (!chartContainerRef.current) return;

    let chart: IChartApi;
    let active = true;

    (async () => {
      const Chart = await import("lightweight-charts");
      if (!active || !chartContainerRef.current) return;

      chart = Chart.createChart(chartContainerRef.current, {
        layout: {
          background: { type: Chart.ColorType.Solid, color: backgroundColor },
          textColor,
        },
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      chart.applyOptions({
        grid: {
          vertLines: { color: gridColor },
          horzLines: { color: gridColor },
        },
      });

      chart.priceScale("right").applyOptions({ borderColor });
      chart.timeScale().applyOptions({ borderColor });

      const { CrosshairMode, LineStyle } = await import("lightweight-charts");
      chart.applyOptions({
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            width: 1,
            color: crosshairColor,
            style: LineStyle.LargeDashed,
            labelBackgroundColor,
          },
          horzLine: {
            width: 1,
            color: crosshairColor,
            style: LineStyle.LargeDashed,
            labelBackgroundColor,
          },
        },
      });

      chartRef.current = chart;

      const handleResize = () => {
        if (!chartContainerRef.current) return;
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    })().then(cleanup => {
      // store cleanup so we can call it on unmount
      (chartRef as any)._resizeCleanup = cleanup;
    });

    return () => {
      active = false;
      if ((chartRef as any)._resizeCleanup) {
        (chartRef as any)._resizeCleanup();
      }
      chartRef.current?.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Update data when weights or timeframe changes
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !weeklyWeights || !dailyWeights) return;

    const data = timeframe === Timeframe.Daily ? dailyWeights : weeklyWeights;

    if (seriesRef.current) {
      seriesRef.current.setData(data);
    } else {
      const newSeries = chart.addSeries(CandlestickSeries);
      newSeries.setData(data);
      seriesRef.current = newSeries;
      chart.timeScale().fitContent();
    }
  }, [timeframe, dailyWeights, weeklyWeights]);

  return <div ref={chartContainerRef} className={styles.chart} />;
};

export default LWChart;
