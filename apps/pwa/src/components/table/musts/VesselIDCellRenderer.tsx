import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CustomCellRendererProps } from "ag-grid-react";
import EntityLocation from "../EntityLocation";
import { Vessel } from "@/models/types/db";

export const VesselIDCellRenderer = (params: CustomCellRendererProps) => {
  const { value, data, node } = params;
  const isGroup = node.group || data?.rowType === "group";

  return (
    <Stack
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {isGroup ? (
        <Stack direction="row">{node?.allChildrenCount} vessel(s)</Stack>
      ) : (
        <Stack my={2} sx={{ height: "100%", justifyContent: "center" }}>
          {(data?.vesselId
            ? [
                {
                  id: data?.vesselId,
                  name: data?.vesselName,
                  location: data?.vesselLocation,
                  type: data?.vesselType,
                },
              ]
            : data?.vessels
          )?.map((vessel: Vessel) => (
            <Stack
              key={vessel?.id}
              direction="row"
              sx={{ flexWrap: "wrap", whiteSpace: "wrap" }}
            >
              <Typography key={vessel?.id} variant="body1">
                {vessel?.name}
              </Typography>
              <EntityLocation location={vessel?.location || ""} />
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
