import TasksDataDisplay from "@/components/data-display/tasks-data-display";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useSortTasks } from "@/hooks/use-sort-tasks";
import { TaskSummary } from "@/models/types/db";
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const TasksCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { todoTasks, inProgressTasks, completedTasks } = useSortTasks(
    (params.value as TaskSummary[]) || []
  );

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!params.node.group && (
        <TasksDataDisplay
          todo={todoTasks}
          inProgress={inProgressTasks}
          completed={completedTasks}
        />
      )}
    </Box>
  );
};
