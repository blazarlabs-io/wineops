/* eslint-disable @typescript-eslint/no-unused-vars */
import QuantityWidget from "@/components/widgets/quantity";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const QuantityCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value, node }) => {
  const actual = Math.floor(Math.random() * 20);
  const supply = Math.floor(Math.random() * 20);
  const demand = Math.floor(Math.random() * 20);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      <QuantityWidget
        actual={actual}
        supply={supply}
        demand={demand}
        status={node.data?.status}
      />
    </Box>
  );
};
