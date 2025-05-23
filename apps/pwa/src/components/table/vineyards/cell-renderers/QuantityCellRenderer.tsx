/* eslint-disable @typescript-eslint/no-unused-vars */
import QuantityWidget from "@/components/widgets/quantity";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const QuantityCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => (
  <div className="flex items-center w-full h-full">
    <QuantityWidget
    // actual={data?.actual}
    // supply={data?.supply}
    // demand={data?.demand}
    // status={data?.status}
    />
  </div>
);
