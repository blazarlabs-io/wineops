import formatDate from "@/utils/date-format";
import { Box, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Timestamp } from "firebase/firestore";
import { type FunctionComponent } from "react";

export const DateCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {value && value !== undefined && value instanceof Timestamp && (
        <Typography className="capitalize">{formatDate(value)}</Typography>
      )}
    </Box>
  );
};
