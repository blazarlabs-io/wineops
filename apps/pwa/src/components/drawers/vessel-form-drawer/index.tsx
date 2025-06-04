import VesselForm from "@/components/forms/vessel/vessel-form";
import { FormMode, Vessel } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import EntityFormDrawer from "../entity-form-drawer";

export type VesselFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  vessel?: Vessel;
  type: FormMode;
};

export default function VesselFormDrawer({
  open,
  onClose,
  vessel,
  type,
}: VesselFormDrawerProps) {
  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Box padding={2} marginTop={4}>
        <Typography variant="h5" fontWeight={"medium"}>
          {type === "create" ? "New Vessel" : "Edit Vessel"}
        </Typography>

        <Typography variant="body2" className="opacity-75">
          {type === "create" ? "Add a new vessel" : "Edit existing vessel"}
        </Typography>
      </Box>

      <VesselForm vessel={vessel} closeDrawer={onClose} type={type} />
    </EntityFormDrawer>
  );
}
