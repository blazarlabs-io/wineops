import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import LabSimpleDataDisplay from "@/components/data-display/lab-simple-data-display";
import { Box } from "@mui/material";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";

export const LabDataCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!params?.node?.group && <LabSimpleDataDisplay data={params.value} />}
    </Box>
  );
};
