import { DEFAULT_LOCALE } from "@/data/constants";
import formatDate from "@/utils/date-format";
import { Box, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const DateCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
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
      <Typography className="capitalize">
        {value
          ? formatDate(value, {
              locale: DEFAULT_LOCALE,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : ""}
      </Typography>
    </Box>
  );
};
