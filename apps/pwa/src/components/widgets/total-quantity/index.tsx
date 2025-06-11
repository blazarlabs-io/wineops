"use client";

import * as React from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { MetricsTotal } from "./types";
import { useChartOptions } from "./data";
import { Stack } from "@mui/material";

type QuantityWidgetTotalProps = {
  metrics?: MetricsTotal[];
};

export default function TotalQuantityWidget({
  metrics = [],
}: QuantityWidgetTotalProps) {
  const { agChartOptions } = useChartOptions(metrics);

  return (
    <Stack
      sx={{
        width: "100%",
        maxWidth: "530px",
        overflow: "hidden",
      }}
    >
      <AgCharts options={agChartOptions as AgChartOptions} />
    </Stack>
  );
}
