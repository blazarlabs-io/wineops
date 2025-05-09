import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import QuantityWidget from "@/components/widgets/quantity";

export const QuantityCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => (
  <div className="flex items-center w-full h-full">
    {/* <QuantityWidget /> */}
  </div>
);
