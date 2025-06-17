/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { BarrelInfoUsage, VesselType } from "@/models/types/db";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const VesselUsageCellRenderer = (params: CustomCellRendererProps) => {
  const { value, data, node } = params;
  const isGroup = node.group || data.rowType === "group";

  const withUsage = isGroup
    ? (value ?? [])
        .flat(Infinity)
        .filter(
          ({ type, usage, barrelInfo, sstInfo }: any) =>
            ((type === VesselType.BARREL
              ? barrelInfo?.usageStatus || BarrelInfoUsage.NEW_VESSEL
              : type === VesselType.STAINLESS_STEEL_TANK
                ? sstInfo?.usage
                : usage) ?? "") !== ""
        )
    : [];

  const usage =
    data?.type === VesselType.BARREL
      ? data?.barrelInfo?.usageStatus || BarrelInfoUsage.NEW_VESSEL
      : data?.type === VesselType.STAINLESS_STEEL_TANK
        ? data?.sstInfo?.usage
        : data?.usage;

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <Typography variant="body1">
          {withUsage.length}/{(value ?? []).length}
        </Typography>
      ) : (
        <Typography variant="body1">{usage}</Typography>
      )}
    </Stack>
  );
};
