import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import LabSimpleDataDisplay from "@/components/data-display/lab-simple-data-display";

export const LabDataCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => (
  <div className="flex items-center w-full h-full">
    <LabSimpleDataDisplay data={value} />
  </div>
);
