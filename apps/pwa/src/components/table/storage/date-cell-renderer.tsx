import { DEFAULT_LOCALE, ROW_HEIGHT_DEFAULT } from "@/data/constants";
import formatDate from "@/utils/date-format";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const DateCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params,
) => {
  const { value, data, node } = params;
  const isGroup = node?.group || node?.data?.rowType === "group";
  const groupField = isGroup ? node?.field : node?.parent?.field;

  const storageDate =
    isGroup &&
    groupField &&
    ["groupByMustName", "groupByWineName"].includes(groupField)
      ? node?.allLeafChildren?.[0]?.data?.actions?.[0]?.date
      : value;
  return (
    <Stack
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Typography className="capitalize">
        {storageDate
          ? formatDate(storageDate, {
              locale: DEFAULT_LOCALE,
            })
          : ""}
      </Typography>
    </Stack>
  );
};
