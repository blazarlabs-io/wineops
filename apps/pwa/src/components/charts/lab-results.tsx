"use client";
import { LabDataSimple } from "@/models/types/db";
import { LineChart } from "@mui/x-charts/LineChart";
import { barElementClasses } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

export type LabResultsChartProps = {
  data: LabDataSimple;
};

export default function LabResultsChart({ data }: LabResultsChartProps) {
  console.log("data", data);

  const margin = { right: 24, left: -24, top: 0, bottom: 0 };
  const uData = data.items.map((item) => item.variation) || new Array(7);
  const pData = data.items.map((item) => item.value) || new Array(7);
  const xLabels = data.items.map((item) => item.name) || new Array(7);
  const colors: string[] = ["#90CAF9", "#EC407A"];

  return (
    <LineChart
      height={80}
      series={[
        {
          data: pData,
          label: "Value",
          color: colors[0],
        },
        { data: uData, label: "Variation", color: colors[1] },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
      yAxis={[{ width: 64 }]}
      margin={margin}
      sx={(theme) => ({
        [`.${barElementClasses.root}`]: {
          fill: (theme.vars || theme).palette.background.paper,
          strokeWidth: 1,
        },
        [`.MuiBarElement-series-l_id`]: {
          stroke: colors[0],
        },
        [`.MuiBarElement-series-r_id`]: {
          stroke: colors[1],
        },
        [`.${axisClasses.root}`]: {
          [`.${axisClasses.tick}, .${axisClasses.line}`]: {
            stroke: "#6a6a6a",
            strokeWidth: 1,
          },
          [`.${axisClasses.tickLabel}`]: {
            fill: "--mui-palette-divider",
          },
        },
        // border: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0px 0px, 0px 0px",
        ...theme.applyStyles("dark", {
          borderColor: "rgba(255,255,255, 0.1)",
          backgroundImage:
            "linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)",
        }),
      })}
    />
  );
}
