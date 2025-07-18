import { Box, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const DeclarantCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {
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
        <Typography>{value?.name}</Typography>
        <Typography variant="caption">{value?.idno_idnp}</Typography>
        <Typography variant="caption">{value?.name2}</Typography>
      </Stack>
    </Box>
  );
};
