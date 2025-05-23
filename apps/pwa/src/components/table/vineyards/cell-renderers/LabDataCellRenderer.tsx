import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import LabSimpleDataDisplay from "@/components/data-display/lab-simple-data-display";

export const LabDataCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  return (
    <div className="flex items-center h-full w-full">
      {!params.node.group && <LabSimpleDataDisplay data={params.value} />}
    </div>
  );
};
