/* eslint-disable @typescript-eslint/no-unused-vars */
import QuantityWidget from "@/components/widgets/quantity";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const QuantityCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => (
  <Box
    display={"flex"}
    alignItems={"center"}
    justifyItems={"center"}
    width={"100%"}
    height={ROW_HEIGHT_DEFAULT}
  >
    <QuantityWidget
    // actual={data?.actual}
    // supply={data?.supply}
    // demand={data?.demand}
    // status={data?.status}
    />
  </Box>
);
