import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const SupplierCellRenderer = ({ value }: CustomCellRendererProps) => {
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
        <Typography>{data?.companyName}</Typography>
      )}
    </Stack>
  );
};
