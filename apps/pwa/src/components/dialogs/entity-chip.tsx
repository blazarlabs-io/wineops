import { DashboardEntity } from "@/models/types/dashboard";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EntityLocation from "../table/EntityLocation";

export default function EntityChip({ row }: { row: DashboardEntity }) {
  const vesselName = row["vesselName" as keyof DashboardEntity] || "";
  const vesselLocation = row["vesselLocation" as keyof DashboardEntity] || "";

  return (
    <Chip
      variant="outlined"
      sx={{
        py: 1,
        height: "auto",
        "& .MuiChip-label": {
          display: "block",
          whiteSpace: "normal",
        },
      }}
      label={
        <Stack
          sx={{
            flexWrap: "wrap",
            whiteSpace: "wrap",
          }}
        >
          {row.name}
          {vesselName && (
            <Typography variant="caption">{`${vesselName}`}</Typography>
          )}
          {vesselLocation && (
            <EntityLocation location={`${vesselLocation}`} variant="caption" />
          )}
        </Stack>
      }
      className="max-w-fit"
    />
  );
}
