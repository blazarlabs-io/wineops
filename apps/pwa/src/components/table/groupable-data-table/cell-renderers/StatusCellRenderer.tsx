import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import VineyardStatusDataDisplay from "@/components/data-display/vineyard-status-data-display";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
}) => (
  <div className="flex items-center h-full w-full">
    <VineyardStatusDataDisplay status={value} />
  </div>
);
