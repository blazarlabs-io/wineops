import { Hub, CheckCircle } from "@mui/icons-material";
import { Stack, Typography, Chip, Tooltip } from "@mui/material";

export default function Logo() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Hub fontSize="medium" color="primary" />
        <Typography variant="h6">WineOps</Typography>
      </Stack>
      <Chip size="small" label="BETA" color="info" />
      <Tooltip title="Connected to production">
        <CheckCircle color="success" fontSize="small" />
      </Tooltip>
    </Stack>
  );
}
