import { Close } from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export type VineyardFormDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function VineyardFormDrawer({
  open,
  onClose,
}: VineyardFormDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 9999 }}>
      <Box
        sx={{
          padding: 2,
          minWidth: "400px",
        }}
        display={"flex"}
        flexDirection={"column"}
      >
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1 } }}
          noValidate
          autoComplete="off"
          className="w-full"
        >
          <Typography variant="h5" fontWeight={"medium"}>
            New Vineyard
          </Typography>
          <Typography variant="body2" className="opacity-75">
            Add a new vineyard
          </Typography>
          <Stack direction="column" spacing={2} paddingTop={4}>
            <TextField
              required
              id="outlined-required"
              label="Name"
              defaultValue="Vinyard 1"
              fullWidth
            />
            <TextField
              required
              id="outlined-required"
              label="Grape Variety"
              defaultValue=""
              fullWidth
            />
            <TextField
              required
              id="outlined-required"
              label="Grape Color"
              defaultValue=""
              fullWidth
            />
            <TextField
              required
              id="outlined-required"
              label="Cadastral"
              defaultValue=""
              fullWidth
            />
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
