"use client";
import { LabDataChart, LabDataSimple } from "@/models/types/db";
import { LineChart } from "@mui/x-charts/LineChart";
import { barElementClasses } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useSortChartData } from "@/hooks/use-sort-chart-data";
import { useTheme } from "@mui/material/styles";

export type LabResultsChartProps = {
  data: LabDataChart;
};

export default function LabResultsChart({ data }: LabResultsChartProps) {
  const { labData } = useSortChartData(data);
  const theme = useTheme();

  const margin = { right: 24, left: -24, top: 8, bottom: 0 };

  const primaryColor: string = theme.palette.primary.main;
  const secondaryColor: string = theme.palette.secondary.main;

  const colors: string[] = [primaryColor, secondaryColor];

  return (
    <>
      {labData && (
        <LineChart
          height={188}
          series={[
            {
              data: labData.sugar,
              label: "Sugar",
              color: colors[0],
            },
            { data: labData.acidity, label: "Acidity", color: colors[1] },
          ]}
          xAxis={[{ scaleType: "point", data: labData.labels }]}
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
            padding: 2,
            borderRadius: 2,
            border: "1px solid rgba(0, 0, 0, 0.05)",
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
            backgroundSize: "32px 16px",
            backgroundPosition: "0px 0px, 0px 0px",
            ...theme.applyStyles("dark", {
              borderColor: "rgba(255,255,255, 0.1)",
              // backgroundImage:
              //   "linear-gradient(rgba(255,255,255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)",
            }),
          })}
        />
      )}
    </>
  );
}
