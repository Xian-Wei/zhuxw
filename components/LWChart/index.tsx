import React, { useEffect, useRef } from "react";

const LWChart = (props: any) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { data } = props;

  const backgroundColor = "#FFFFFF00";
  const lineColor = "#2962FF";
  const textColor = "black";
  const areaTopColor = "#2962FF";
  const areaBottomColor = "rgba(41, 98, 255, 0.28)";

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
      newSeries.setData(data);

      chart.timeScale().fitContent();

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    })();
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ display: "flex", height: "100%", width: "100%" }}
    />
  );
};

export default LWChart;
