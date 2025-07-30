import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";

export const MustIDCellRenderer = (params: CustomCellRendererProps) => {
  const { value, data, node } = params;
  const isGroup = node.group || data.rowType === "group";

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
      sx={{ overflowY: "auto", overflowX: "hidden" }}
    >
      {isGroup ? (
        <></>
      ) : (
        <Stack my={2} sx={{ height: "100%", justifyContent: "center" }}>
          <Stack sx={{ flexWrap: "wrap", whiteSpace: "wrap" }}>
            <Typography variant="body1">{data?.name}</Typography>
            <Typography variant="body1">{data?.grapeVariety}</Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
