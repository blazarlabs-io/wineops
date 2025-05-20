import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import VineyardStatusDataDisplay from "@/components/data-display/vineyard-status-data-display";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  return (
    <div className="flex items-center h-full w-full">
      {params.node.allChildrenCount == 1 &&
        params.node.allLeafChildren &&
        params.node.allLeafChildren.length > 0 && (
          <VineyardStatusDataDisplay
            status={params.node.allLeafChildren[0].data.status}
          />
        )}
    </div>
  );
};
