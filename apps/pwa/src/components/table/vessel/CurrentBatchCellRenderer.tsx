import { DEFAULT_LOCALE, ROW_HEIGHT_DEFAULT } from "@/data/constants";
import formatDate from "@/utils/date-format";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const CurrentBatchCellRenderer = (params: CustomCellRendererProps) => {
  const { data, node } = params;
  const isGroup = node.group || data.rowType === "group";

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <></>
      ) : (
        <Stack justifyContent="center">
          <Typography variant="body1">{data?.currentUsage}</Typography>
          {data?.startDate && (
            <Typography variant="body2">
              {formatDate(data?.startDate, { locale: DEFAULT_LOCALE })}
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
};
