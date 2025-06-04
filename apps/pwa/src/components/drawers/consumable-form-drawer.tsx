import { FormMode, Consumable } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import EntityFormDrawer from "./entity-form-drawer";
import ConsumableForm from "../forms/consumable/consumable-form";

export type ConsumableFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  consumable?: Consumable;
  type: FormMode;
};

export default function ConsumableFormDrawer({
  open,
  onClose,
  consumable,
  type,
}: ConsumableFormDrawerProps) {
  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Box padding={2} marginTop={4}>
        <Typography variant="h5" fontWeight={"medium"}>
          {type === "create" ? "New Consumable" : "Edit Consumable"}
        </Typography>

        <Typography variant="body2" className="opacity-75">
          {type === "create"
            ? "Add a new consumable"
            : "Edit existing consumable"}
        </Typography>
      </Box>

      <ConsumableForm
        consumable={consumable}
        closeDrawer={onClose}
        type={type}
      />
    </EntityFormDrawer>
  );
}
