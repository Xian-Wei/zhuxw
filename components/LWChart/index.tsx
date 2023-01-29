import React, { useEffect, useRef } from "react";
import WeightData from "../../models/WeightData";

interface WeightProps {
  weights: WeightData[];
}

const LWChart = ({ weights }: WeightProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const backgroundColor = "#FFFFFF00";
  const textColor = "white";

  useEffect(() => {
    (async () => {
      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
      };

      const Chart = await import("lightweight-charts");
      const chart = Chart.createChart(
        chartContainerRef.current as string | HTMLElement,
        {
          layout: {
            background: { type: Chart.ColorType.Solid, color: backgroundColor },
            textColor,
          },
          width: chartContainerRef.current?.clientWidth,
          height: chartContainerRef.current?.clientHeight,
        }
      );

      const newSeries = chart.addCandlestickSeries();
      newSeries.setData(weights);

      chart.timeScale().fitContent();

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    })();
  }, [weights]);

  return (
    <div
      ref={chartContainerRef}
      style={{ display: "flex", height: "100%", width: "100%" }}
      key={weights[0].open} // For re-rendering purposes
    />
  );
};

export default LWChart;
