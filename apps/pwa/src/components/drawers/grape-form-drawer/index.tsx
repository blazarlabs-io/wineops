import GrapeForm from "@/components/forms/grape/grape-form";
import { FormMode, Grape } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import EntityFormDrawer from "../entity-form-drawer";

export type GrapeFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  grape: Grape;
  type: FormMode;
};

export default function GrapeFormDrawer({
  open,
  onClose,
  grape,
  type,
}: GrapeFormDrawerProps) {
  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Box padding={2} marginTop={4}>
        <Typography variant="h5" fontWeight={"medium"}>
          Buy Grapes
        </Typography>

        <Typography variant="body2" className="opacity-75">
          {type === "create" ? "New batch" : "Existing batch"}
        </Typography>
      </Box>

      <GrapeForm grape={grape} closeDrawer={onClose} type={type} />
    </EntityFormDrawer>
  );
}
