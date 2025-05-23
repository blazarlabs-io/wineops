import TasksDataDisplay from "@/components/data-display/tasks-data-display";
import { useSortTasks } from "@/hooks/use-sort-tasks";
import { TaskSummary } from "@/models/types/db";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const TasksCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { todoTasks, inProgressTasks, completedTasks } = useSortTasks(
    (params.value as TaskSummary[]) || []
  );

  return (
    <>
      {!params.node.group && (
        <TasksDataDisplay
          todo={todoTasks}
          inProgress={inProgressTasks}
          completed={completedTasks}
        />
      )}
    </>
  );
};
