/* eslint-disable @typescript-eslint/no-explicit-any */
import TotalQuantityPieWidget from "@/components/widgets/total-quantity/total-qty-pie";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const QtyCellRenderer = (
  params: CustomCellRendererProps & { alignItems?: string }
) => {
  const { value, node, data, alignItems } = params;
  const isGroup = node.group || data.rowType === "group";
  const groupField = isGroup ? node?.field : node?.parent?.field;

  const addedMusts = new Set<string>();
  const metrics = isGroup
    ? (node?.allLeafChildren?.reduce((acc, { data }) => {
        const { id, metrics } = data;
        if (!addedMusts.has(id)) {
          addedMusts.add(id);
          acc.push(metrics);
        }
        return acc;
      }, [] as any[]) ?? [])
    : undefined;

  return (
    <Stack
      alignItems={(!isGroup && alignItems) || "flex-start"}
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup &&
      groupField !== "groupByMustName" &&
      groupField !== "groupByWineName" ? (
        <Stack height="100%" alignItems="flex-start" justifyContent="center">
          <TotalQuantityPieWidget metrics={metrics} width={80} height={80} />
        </Stack>
      ) : (
        <Typography variant="body2">{`${value || metrics?.[0]?.actual}`}</Typography>
      )}
    </Stack>
  );
};
