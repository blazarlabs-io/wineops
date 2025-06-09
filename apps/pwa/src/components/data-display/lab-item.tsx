import { LabElement } from "@/models/types/db";
import UnitDisplay from "./unit-display";
import Variation from "./variation";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface LabItemProps {
  label: string;
  data: Partial<LabElement>;
  variant?: "small";
}

export default function LabItem({ label, data, variant }: LabItemProps) {
  if (!data || !data?.value) return null;

  const isSmall = variant === "small";

  return (
    <Stack gap={isSmall ? 0.5 : 1}>
      <Typography
        component="div"
        variant={isSmall ? "caption" : "body2"}
        color="textDisabled"
      >
        <Stack gap={isSmall ? 0.5 : 1} flexDirection="row">
          {label}
          <UnitDisplay unit={data?.unit ?? ""} />
        </Stack>
      </Typography>

      <Typography
        component="span"
        variant={isSmall ? "caption" : "body1"}
        sx={{ display: "flex", flexDirection: "row", gap: isSmall ? 0 : 1 }}
      >
        <span className="text-muted-foreground">{data?.value}</span>
        <Variation variation={data?.variation ?? 0} />
      </Typography>
    </Stack>
  );
}
