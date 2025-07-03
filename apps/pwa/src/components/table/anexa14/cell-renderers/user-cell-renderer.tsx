import { Box, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const UserCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Stack>
        <Typography>
          {!(value?.name && value?.lastName)
            ? `${value?.email || ""}`
            : `${value?.name || ""} ${value?.lastName || ""} `}
        </Typography>
        <Typography variant="caption">
          {!(value?.name && value?.lastName)
            ? value?.id || ""
            : value?.email || ""}
        </Typography>
      </Stack>
    </Box>
  );
};
