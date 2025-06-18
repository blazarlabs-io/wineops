import PriorityDataDisplay from "@/components/data-display/priority-data-display";
import { Priority } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Timestamp } from "firebase/firestore";
import { type FunctionComponent } from "react";

export const PriorityCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {
  console.log("XXXXXXXXXXX", value);
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
        <PriorityDataDisplay status={value as Priority} />
      )}
    </Box>
  );
};
