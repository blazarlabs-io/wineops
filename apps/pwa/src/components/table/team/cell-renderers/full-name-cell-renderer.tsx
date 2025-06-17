import { Avatar, Box, Chip, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const FullNameCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {
  console.log("VALUE", value, node.data.lastName);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Typography>{`${value} ${node.data.lastName}`}</Typography>
    </Box>
  );
};
