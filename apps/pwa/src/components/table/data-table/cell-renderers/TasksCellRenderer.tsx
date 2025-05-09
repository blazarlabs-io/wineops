import type { CustomCellRendererProps } from 'ag-grid-react';
import { type FunctionComponent } from 'react';

import TasksDataDisplay from '@/components/data-display/tasks-data-display';

export const TasksCellRenderer: FunctionComponent<CustomCellRendererProps> = ({ value }) => (
  <TasksDataDisplay />
);
