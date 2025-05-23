/* eslint-disable @typescript-eslint/no-explicit-any */
import TasksDataDisplay from "@/components/data-display/tasks-data-display";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useSortTasks } from "@/hooks/use-sort-tasks";
import { TaskSummary } from "@/models/types/db";
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

function flattenArray<T>(arr: any[]): T[] {
  const result: T[] = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenArray<T>(item));
    } else {
      result.push(item);
    }
  }

  return result;
}

export const TasksCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { todoTasks, inProgressTasks, completedTasks } = useSortTasks(
    (params.node.group
      ? flattenArray(params.node.aggData?.tasks)
      : (params.value as TaskSummary[])) || []
  );

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!params.node.group ? (
        <TasksDataDisplay
          todo={todoTasks}
          inProgress={inProgressTasks}
          completed={completedTasks}
        />
      ) : (
        <div className="flex items-center gap-1 cursor-pointer max-h-[24px]">
          <TasksDataDisplay
            todo={todoTasks}
            inProgress={inProgressTasks}
            completed={completedTasks}
          />
        </div>
      )}
    </Box>
  );
};
