import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import StatusDataDisplay from "@/components/data-display/status-data-display";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  return (
    <div className="flex items-center h-full w-full">
      {params.node.allChildrenCount == 1 &&
        params.node.allLeafChildren &&
        params.node.allLeafChildren.length > 0 && (
          <StatusDataDisplay
            status={params.node.allLeafChildren[0].data.status}
          />
        )}
    </div>
  );
};
