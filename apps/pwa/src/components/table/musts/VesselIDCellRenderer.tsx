import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";
import EntityLocation from "../EntityLocation";
import { Vessel } from "@/models/types/db";

export const VesselIDCellRenderer = (params: CustomCellRendererProps) => {
  const { value, data, node } = params;
  const isGroup = node.group || data.rowType === "group";

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
      sx={{ overflowY: "auto" }}
    >
      {isGroup ? (
        <></>
      ) : (
        <Stack
          gap={1}
          direction="row"
          alignItems="flex-end"
          justifyContent="flex-start"
        >
          <Stack justifyContent="flex-end">
            {data?.vessels?.map((vessel: Vessel) => (
              <Stack key={vessel?.id} direction="row">
                <Typography key={vessel?.id} variant="body1">
                  {vessel?.name}
                </Typography>
                <EntityLocation location={vessel?.location || ""} />
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
