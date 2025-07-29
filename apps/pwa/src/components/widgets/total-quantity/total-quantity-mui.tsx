import { BarChart } from "@mui/x-charts/BarChart";
import { getStripedPatterns, TOTAL_QUANTITY_COLORS } from "./constants";
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
      {getStripedPatterns()}
    </BarChart>
  );
}
