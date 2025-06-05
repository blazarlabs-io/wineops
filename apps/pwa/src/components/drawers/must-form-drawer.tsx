import { FormMode, Must } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import EntityFormDrawer from "./entity-form-drawer";
import MustForm from "../forms/must/must-form";

export type MustFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  must?: Must;
  type: FormMode;
};

export default function MustFormDrawer({
  open,
  onClose,
  must,
  type,
}: MustFormDrawerProps) {
  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Box padding={2} marginTop={4}>
        <Typography variant="h5" fontWeight={"medium"}>
          Buy Must
        </Typography>

        <Typography variant="body2" className="opacity-75">
          {type === "create" ? "New batch" : "Existing batch"}
        </Typography>
      </Box>

      <MustForm must={must} closeDrawer={onClose} type={type} />
    </EntityFormDrawer>
  );
}
