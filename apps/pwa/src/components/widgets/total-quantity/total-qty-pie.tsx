"use client";

import * as React from "react";
import { MetricsTotal } from "./types";
import { useChartOptions } from "./data";
import { Stack, Typography } from "@mui/material";
import { pieArcClasses, PieChart } from "@mui/x-charts/PieChart";
import { formatNumberWithUnit } from "@/utils/number-format";
import { getStripedPatterns } from "./constants";

const LABELS = {
  sur: "Surplus",
  def: "Deficit",
  ar: "At Risk",
  co: "Closed Orders",
};

type QuantityWidgetTotalProps = {
  metrics?: MetricsTotal[];
  width?: number;
  height?: number;
};

export default function TotalQuantityPieWidget({
  metrics = [],
  height,
  width,
}: QuantityWidgetTotalProps) {
  const { muiDataset, muiSeries, valueFormatter, relatedData } =
    useChartOptions(metrics);

  const dataset = muiDataset[0];
  const data = muiSeries.map(({ label, dataKey, color }) => ({
    id: dataKey,
    value: (dataset[dataKey as keyof typeof dataset] as number) || 0,
    label,
    color,
  }));

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      gap={1}
    >
      <PieChart
        skipAnimation={true}
        hideLegend={true}
        series={[
          {
            data,
            valueFormatter: ({ value }: { value: number }) =>
              valueFormatter(value),
          },
        ]}
        sx={{
          [`& .${pieArcClasses.root}`]: {
            strokeWidth: 1,
            stroke: "#DBDBDB",
          },
        }}
        slotProps={{
          legend: {
            direction: "horizontal",
            position: {
              vertical: "middle",
              horizontal: "center",
            },
            sx: {
              gap: 0.5,
            },
          },
        }}
        localeText={{ noData: "" }}
        {...(height && { height })}
        {...((width || height) && { width: width || height })}
      >
        {getStripedPatterns(
          data.map(({ id }) => id.replace("striped", "").toLowerCase())
        )}
      </PieChart>
      <Stack>
        {Object.entries(relatedData).map(([key, value]) => (
          <Typography key={key} variant="caption">
            {LABELS[key as keyof typeof LABELS] || key}:{" "}
            <strong>{formatNumberWithUnit(value, "T", 2)}</strong>
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}
