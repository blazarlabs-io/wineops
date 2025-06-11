import { BarChart } from "@mui/x-charts/BarChart";
import { TOTAL_QUANTITY_COLORS } from "./constants";
import { useChartOptions } from "./data";
import { MetricsTotal } from "./types";

const chartSetting = {
  xAxis: [
    {
      max: 100,
      label: "%",
    },
  ],
  height: 110,
};

type QuantityWidgetTotalProps = {
  metrics?: MetricsTotal[];
};

export default function TotalQuantityMui({
  metrics = [],
}: QuantityWidgetTotalProps) {
  const { muiDataset, muiSeries } = useChartOptions(metrics);
  return (
    <BarChart
      layout="horizontal"
      dataset={muiDataset}
      yAxis={[{ scaleType: "band", dataKey: "total", position: "none" }]}
      series={muiSeries}
      {...chartSetting}
    >
      {Object.entries(TOTAL_QUANTITY_COLORS).map(
        ([name, { darkColor = "", lightColor = "" }]) => {
          return (
            <pattern
              key={name}
              id={`StripedPattern-${name}`}
              patternUnits="userSpaceOnUse"
              width="16"
              height="16"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="16" fill={`${darkColor}`} />
              <rect x="8" width="8" height="16" fill={`${lightColor}`} />
            </pattern>
          );
        }
      )}
    </BarChart>
  );
}
