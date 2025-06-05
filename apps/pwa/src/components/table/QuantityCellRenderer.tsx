import QuantityWidget from "@/components/widgets/quantity";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";

export const QuantityCellRenderer = (params: CustomCellRendererProps) => {
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <></>
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
