import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box, Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const TitleCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 0,
      }}
      direction={"column"}
    >
      <Typography>{value}</Typography>
      <Typography>{`${node.data.createdBy.name} ${node.data.createdBy.lastName}`}</Typography>
      <Typography
        variant="body2"
        color="textDisabled"
      >{`${node.data.duration} Hrs`}</Typography>
    </Stack>
  );
};
