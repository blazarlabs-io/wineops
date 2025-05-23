import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import VineyardStatusDataDisplay from "@/components/data-display/status-data-display";
import { Box, Typography } from "@mui/material";

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={"100%"}
    >
      <Typography variant="body2">
        <VineyardStatusDataDisplay status={params.value} />
      </Typography>
    </Box>
  );
};
