import { Stack, Typography, TypographyVariant } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

export default function EntityLocation({
  location,
  variant = "body2",
}: {
  location: string;
  variant?: TypographyVariant;
}) {
  if (!location) return null;

  return (
    <Stack direction="row" alignItems="center">
      <LocationOnOutlinedIcon
        sx={({ typography }) => ({
          width: typography.body1.fontSize,
          height: typography.body1.fontSize,
        })}
      />
      <Typography variant={variant}>{location}</Typography>
    </Stack>
  );
}
