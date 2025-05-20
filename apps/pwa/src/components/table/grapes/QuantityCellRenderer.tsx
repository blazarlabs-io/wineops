import QuantityWidget from "@/components/widgets/quantity";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";

export const QuantityCellRenderer = ({ value }: CustomCellRendererProps) => {
  const data = Array.isArray(value) ? value[0] : {};

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      {value && Array.isArray(value) && Array.isArray(value[0]) ? (
        <></>
      ) : (
        <QuantityWidget
          actual={data?.actual}
          supply={data?.supply}
          demand={data?.demand}
          status={data?.status}
        />
      )}
    </Stack>
  );
};
