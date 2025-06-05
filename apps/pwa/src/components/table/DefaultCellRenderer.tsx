import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const DefaultCellRenderer = (
  params: CustomCellRendererProps & { alignItems?: string }
) => {
  const { value, node, data, alignItems } = params;
  const isGroup = node.group || data.rowType === "group";

  return (
    <Stack
      alignItems={(!isGroup && alignItems) || "flex-start"}
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? <></> : <Typography variant="body1">{value}</Typography>}
    </Stack>
  );
};
