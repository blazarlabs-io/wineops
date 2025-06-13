import { Avatar, Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const AvatarCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
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
      <Avatar src={node.data.avatar} sx={{ width: 40, height: 40 }}>
        {node.data.name[0]}
      </Avatar>
    </Box>
  );
};
