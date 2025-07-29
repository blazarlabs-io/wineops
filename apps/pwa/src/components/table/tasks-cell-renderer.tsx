
import TasksDataDisplay from "@/components/data-display/tasks-data-display";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useSortTasks } from "@/hooks/use-sort-tasks";
import { TaskSummary } from "@/models/types/db";
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useMemo, type FunctionComponent } from "react";

function flattenArray<T>(arr: any[]): T[] {
  const result: T[] = [];

  if (!Array.isArray(arr)) return result;

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
  const { value, data, node } = params;
  const isGroup = node.group || data.rowType === "group";

  const childrenTasks = useMemo(() => {
    return (
      node.aggData?.tasks ||
      node.allLeafChildren
        ?.map((child) => child.data?.tasks)
        .filter((tasks) => Array.isArray(tasks) && tasks.length > 0)
    );
  }, [node.aggData?.tasks, node.allLeafChildren]);

  const tasks = useMemo(() => {
    return (isGroup ? flattenArray<TaskSummary>(childrenTasks) : value) || [];
  }, [childrenTasks, isGroup, value]);

  const { todoTasks, inProgressTasks, completedTasks } = useSortTasks(tasks);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyItems="center"
      width="100%"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <div className="flex items-center gap-1 cursor-pointer max-h-[24px]">
          <TasksDataDisplay
            todo={todoTasks}
            inProgress={inProgressTasks}
            completed={completedTasks}
          />
        </div>
      ) : (
        <TasksDataDisplay
          todo={todoTasks}
          inProgress={inProgressTasks}
          completed={completedTasks}
        />
      )}
    </Box>
  );
};
