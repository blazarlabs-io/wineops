import TaskStatusDataDisplay from "@/components/data-display/task-status-data-display";
import { EntityStatus } from "@/models/types/dashboard";
import { Priority, TaskStatus } from "@/models/types/db";
import { Box, Chip } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
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
      {}
      {value && value !== undefined && (
        <TaskStatusDataDisplay
          status={value as TaskStatus}
          onSelect={() => {}}
        />
      )}
    </Box>
  );
};
