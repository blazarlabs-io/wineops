import StatusDataDisplay from "@/components/data-display/status-data-display";
import { DEFAULT_LOCALE, ROW_HEIGHT_DEFAULT } from "@/data/constants";
import formatDate from "@/utils/date-format";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const StatusCellRenderer = (
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
      {isGroup ? (
        <></>
      ) : (
        <>
          {<StatusDataDisplay status={value?.status} />}
          {value?.date && (
            <Typography variant="body2">
              {formatDate(value?.date, { locale: DEFAULT_LOCALE })}
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
};
