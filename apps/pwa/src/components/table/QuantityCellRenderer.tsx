import QuantityWidget from "@/components/widgets/quantity";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";
import TotalQuantityPieWidget from "../widgets/total-quantity/total-qty-pie";

export const QuantityCellRenderer = (params: CustomCellRendererProps) => {
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  const metrics = (node?.allLeafChildren || []).map(
    ({ data }) => data?.metrics
  );

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <Stack height="100%" alignItems="flex-start" justifyContent="center">
          <TotalQuantityPieWidget metrics={metrics} width={80} height={80} />
        </Stack>
      ) : (
        <>
          <QuantityWidget
            actual={value?.actual}
            supply={value?.supply}
            demand={value?.demand}
            status={value?.status}
          />
        </>
      )}
    </Stack>
  );
};
