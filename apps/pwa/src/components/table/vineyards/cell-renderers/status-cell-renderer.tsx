import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import VineyardStatusDataDisplay from "@/components/data-display/status-data-display";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box } from "@mui/material";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = (
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
      {!params.node.group && (
        <VineyardStatusDataDisplay status={params.value} />
      )}
    </Box>
  );
};
