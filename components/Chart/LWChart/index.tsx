import React, { useEffect, useRef, useState } from "react";
import { Timeframe } from "../../../models/Timeframe";
import { IChartApi, ISeriesApi } from "lightweight-charts";
import styles from "./lwchart.module.scss";

interface ChartProps {
  weeklyWeights: any;
  dailyWeights: any;
  timeframe: Timeframe;
}

const LWChart = ({ weeklyWeights, dailyWeights, timeframe }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi>();
  const [series, setSeries] = useState<ISeriesApi<"Candlestick">>();

  const backgroundColor = "#FFFFFF00";
  const textColor = "white";
  const gridColor = "#6e6e6e1a";
  const borderColor = "#FFFFFF00";
  const crosshairColor = "#ffffff4f";
  const labelBackgroundColor = "#6464c8";

  useEffect(() => {
    (async () => {
      if (!chart) {
        if (await import("lightweight-charts")) {
          const Chart = await import("lightweight-charts");
          const newChart = Chart.createChart(
            chartContainerRef.current as string | HTMLElement,
            {
              layout: {
                background: {
                  type: Chart.ColorType.Solid,
                  color: backgroundColor,
                },
                textColor,
              },
              width: chartContainerRef.current?.clientWidth,
              height: chartContainerRef.current?.clientHeight,
            }
          );

          setChart(newChart);
        }
      }
    })();
  }, [chart]);

  useEffect(() => {
    (async () => {
      if (chart && weeklyWeights && dailyWeights) {
        const handleResize = () => {
          chart.applyOptions({
            height: chartContainerRef.current?.clientHeight,
            width: chartContainerRef.current?.clientWidth,
          });
        };

        // Series
        const newSeries = chart.addCandlestickSeries();
        newSeries.setData(weeklyWeights);

        setSeries(newSeries);

        // Grid
        chart.applyOptions({
          grid: {
            vertLines: { color: gridColor },
            horzLines: { color: gridColor },
          },
        });

        // Border vertical axis
        chart.priceScale().applyOptions({ borderColor: borderColor });

        // Border horizontal axis
        chart.timeScale().applyOptions({ borderColor: borderColor });

        const CrosshairMode = await (
          await import("lightweight-charts")
        ).CrosshairMode;
        const LineStyle = await (await import("lightweight-charts")).LineStyle;

        // Customizing the Crosshair
        chart.applyOptions({
          crosshair: {
            mode: CrosshairMode.Normal,

            // Vertical crosshair line (showing Date in Label)
            vertLine: {
              width: 1,
              color: crosshairColor,
              style: LineStyle.LargeDashed,
              labelBackgroundColor: labelBackgroundColor,
            },

            // Horizontal crosshair line (showing Price in Label)
            horzLine: {
              width: 1,
              color: crosshairColor,
              style: LineStyle.LargeDashed,
              labelBackgroundColor: labelBackgroundColor,
            },
          },
        });

        chart.timeScale().fitContent();

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          chart.remove();
        };
      }
    })();
  }, [chart, dailyWeights, weeklyWeights]);

  useEffect(() => {
    const updateChart = () => {
      if (chart && series && weeklyWeights && dailyWeights) {
        const newSeries = chart.addCandlestickSeries();

        chart?.removeSeries(series);
        if (timeframe == Timeframe.Daily) {
          newSeries.setData(dailyWeights);
        } else if (timeframe == Timeframe.Weekly) {
          newSeries.setData(weeklyWeights);
        }

        setSeries(newSeries);
      }
    };
    updateChart();
  }, [timeframe, dailyWeights, weeklyWeights]);

  return <div ref={chartContainerRef} className={styles.chart} />;
};

export default LWChart;
