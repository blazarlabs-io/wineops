import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const InUseTodayCellRenderer = (
  params: CustomCellRendererProps & { alignItems?: string }
) => {
  const { value, node, data, alignItems } = params;
  const isGroup = node.group || data.rowType === "group";

  const notifications = isGroup
    ? node?.aggData?.qty.filter(
        (qty: number, index: number) =>
          (qty || 0) < (node?.aggData?.inUseToday[index] || 0)
      )?.length
    : 0;

  return (
    <Stack
      alignItems={(!isGroup && alignItems) || "flex-start"}
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <>
          {notifications > 0 ? (
            <Typography variant="body2">
              {notifications}{" "}
              {notifications === 1 ? "notification" : "notifications"}
            </Typography>
          ) : (
            ""
          )}
        </>
      ) : (
        <Typography variant="body1">{value}</Typography>
      )}
    </Stack>
  );
};
