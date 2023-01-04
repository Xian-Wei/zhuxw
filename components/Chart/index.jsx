import React, { useEffect, useRef } from "react";

export default function Chart(props) {
  const { data } = props;

  const backgroundColor = "white";
  const lineColor = "#2962FF";
  const textColor = "black";
  const areaTopColor = "#2962FF";
  const areaBottomColor = "rgba(41, 98, 255, 0.28)";

  const chartContainerRef = useRef();

  useEffect(() => {
    (async () => {
      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      };

      const Chart = await import("lightweight-charts");
      const chart = Chart.createChart(chartContainerRef.current, {
        layout: {
          background: { type: Chart.ColorType.Solid, color: backgroundColor },
          textColor,
        },
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
      chart.timeScale().fitContent();

      const newSeries = chart.addCandlestickSeries({
        lineColor,
        topColor: areaTopColor,
        bottomColor: areaBottomColor,
      });
      newSeries.setData(data);

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    })();
  }, []);

  return (
    <div ref={chartContainerRef} style={{ height: "100%", width: "100%" }} />
  );
}
