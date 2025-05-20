import TasksDataDisplay from "@/components/data-display/tasks-data-display";
import { useSortTasks } from "@/hooks/use-sort-tasks";
import { IRowNode } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const TasksCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const allLeafChildren = params.node.allLeafChildren;

  const { todoTasks, inProgressTasks, completedTasks } = useSortTasks(
    (allLeafChildren as IRowNode[]) || []
  );

  if (!allLeafChildren) {
    // Handle the case where allLeafChildren is null
    return <div>No data available</div>;
  }

  return (
    <TasksDataDisplay
      todo={todoTasks}
      inProgress={inProgressTasks}
      completed={completedTasks}
    />
  );
};
