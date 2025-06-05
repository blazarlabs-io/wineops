import { Stack, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

export default function EntityLocation({ location }: { location: string }) {
  if (!location) return null;

  return (
    <Stack direction="row" alignItems="center">
      <LocationOnOutlinedIcon
        sx={({ typography, palette }) => ({
          width: typography.body1.fontSize,
          height: typography.body1.fontSize,
          color: palette.text.secondary,
        })}
      />
      <Typography variant="body2">{location}</Typography>
    </Stack>
  );
}
