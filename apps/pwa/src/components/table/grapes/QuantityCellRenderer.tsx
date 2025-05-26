import QuantityWidget from "@/components/widgets/quantity";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";

export const QuantityCellRenderer = (params: CustomCellRendererProps) => {
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  const localData = Array.isArray(value) ? value[0] : {};

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      sx={{ height: "100%", lineHeight: 1 }}
    >
      {isGroup || (value && Array.isArray(value) && Array.isArray(value[0])) ? (
        <></>
      ) : (
        <QuantityWidget
          actual={localData?.actual}
          supply={localData?.supply}
          demand={localData?.demand}
          status={localData?.status}
        />
      )}
    </Stack>
  );
};
