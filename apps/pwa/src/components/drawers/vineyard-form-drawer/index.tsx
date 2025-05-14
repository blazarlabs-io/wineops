import VineyardCreateEditForm from "@/components/forms/vineyard/vineyard-create-edit-form";
import { Vineyard } from "@/models/types/db";
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
  vineyard: Vineyard;
  type: "create" | "edit";
};

export default function VineyardFormDrawer({
  open,
  onClose,
  vineyard,
  type,
}: VineyardFormDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 99 }}>
      <Box
        sx={{
          padding: 2,
          minWidth: "320px",
          maxWidth: "530px",
          background: "var(--mui-palette-background-default)",
          height: "100vh",
        }}
        display={"flex"}
        flexDirection={"column"}
      >
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box padding={2} marginTop={2}>
          <Typography variant="h5" fontWeight={"medium"}>
            {type === "create" ? "New Vineyard" : "Edit Vineyard"}
          </Typography>
          <Typography variant="body2" className="opacity-75">
            {type === "create"
              ? "Add a new vineyard"
              : "Edit existing vineyard"}
          </Typography>
        </Box>
        <VineyardCreateEditForm vineyard={vineyard} closeDrawer={onClose} />
      </Box>
    </Drawer>
  );
}
