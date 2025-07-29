import { Box, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const DepartmentCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {

  const normalizeData = (data: string) => {
    if (data.includes("-")) {
      return data.split("-").join(" ");
    }
    return data;
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {value && value !== undefined && (
        <Typography className="capitalize">{normalizeData(value)}</Typography>
      )}
    </Box>
  );
};
