import { FormMode, Chemistry } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import EntityFormDrawer from "./entity-form-drawer";
import ChemistryForm from "../forms/chemistry/chemistry-form";

export type ChemistryFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  chemistryItem?: Chemistry;
  type: FormMode;
};

export default function ChemistryFormDrawer({
  open,
  onClose,
  chemistryItem,
  type,
}: ChemistryFormDrawerProps) {
  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Box padding={2} marginTop={4}>
        <Typography variant="h5" fontWeight={"medium"}>
          {type === "create" ? "New chemistry item" : "Edit chemistry item"}
        </Typography>

        <Typography variant="body2" className="opacity-75">
          {type === "create"
            ? "Add a new chemistry item"
            : "Edit existing chemistry item"}
        </Typography>
      </Box>

      <ChemistryForm
        chemistryItem={chemistryItem}
        closeDrawer={onClose}
        type={type}
      />
    </EntityFormDrawer>
  );
}
