import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import StatusDataDisplay from "@/components/data-display/status-data-display";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
}) => (
  <div className="flex items-center h-full w-full">
    <StatusDataDisplay status={value} />
  </div>
);
