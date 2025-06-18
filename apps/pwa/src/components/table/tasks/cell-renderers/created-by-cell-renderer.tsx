import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Timestamp } from "firebase/firestore";
import { type FunctionComponent } from "react";

export const CreatedByCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ node, value }) => {
  return (
    <Stack
      direction="column"
      sx={{
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <div className="flex items-center gap-2">
        <Avatar src={node.data.avatar} sx={{ width: 24, height: 24 }}>
          {node.data.name}
        </Avatar>
        <Typography>{`${node.data.createdBy.name} ${node.data.createdBy.lastName}`}</Typography>
      </div>
      <Chip size="small" label={node.data.createdBy.role} />
    </Stack>
  );
};
