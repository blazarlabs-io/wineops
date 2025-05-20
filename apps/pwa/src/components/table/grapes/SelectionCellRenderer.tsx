import GrapeDetailsWidget from "@/components/widgets/grape/grape-details-widget";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const SelectionCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node }) => {
  return (
    <>
      {node.group ? (
        <div style={{}}></div>
      ) : (
        <div
          style={{
            backgroundColor: "var(--mui-palette-background-default)",
          }}
          className="flex items-start justify-center flex-col gap-2 pl-2 absolute h-full top-0 left-0 w-full z-[999]"
        >
          <GrapeDetailsWidget grape={node.data} />
        </div>
      )}
    </>
  );
};
