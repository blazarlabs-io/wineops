"use client";
import { LabDataChart } from "@/models/types/db";
import { LineChart } from "@mui/x-charts/LineChart";
import { barElementClasses } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useSortChartData } from "@/hooks/use-sort-chart-data";
import { useTheme } from "@mui/material/styles";
import { RESULTS_KEYS } from "../data-display/lab-report-responsible-data-display";

type LabResultsChartProps = {
  data: LabDataChart;
};

export default function LabResultsChart({ data }: LabResultsChartProps) {
  const { labData } = useSortChartData(data);
  const { palette } = useTheme();

  const colors: string[] = [
    palette.primary.main,
    palette.secondary.main,
    palette.success.main,
  ];

  if (!labData) return null;

  const series = RESULTS_KEYS.reduce(
    (acc, key, index) => {
      const data = labData[key as "alcohol" | "sugar" | "acidity"];

      if (data && data.length > 0) {
        acc.push({
          data,
          label: `${key.charAt(0).toUpperCase()}${key.slice(1)}`,
          color: colors[index % colors.length],
        });
      }

      return acc;
    },
    [] as Array<{ data: number[]; label: string; color: string }>,
  );

  return (
    <LineChart
      height={124}
      series={series}
      xAxis={[{ scaleType: "point", data: labData.labels }]}
      yAxis={[{ width: 64 }]}
      margin={{ right: 50, left: -10, top: 8, bottom: 0 }}
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
        padding: 1,
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.05)",
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
        backgroundSize: "32px 16px",
        backgroundPosition: "0px 0px, 0px 0px",
        ...theme.applyStyles("dark", {
          borderColor: "rgba(255,255,255, 0.1)",
        }),
      })}
    />
  );
}
