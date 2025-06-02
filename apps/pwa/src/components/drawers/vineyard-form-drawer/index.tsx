import VineyardCreateEditForm from "@/components/forms/vineyard/vineyard-create-edit-form";
import { FormMode, Vineyard } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import EntityFormDrawer from "../entity-form-drawer";

export type VineyardFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  vineyard: Vineyard;
  type: FormMode;
};

export default function VineyardFormDrawer({
  open,
  onClose,
  vineyard,
  type,
}: VineyardFormDrawerProps) {
  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Box padding={2} marginTop={4}>
        <Typography variant="h5" fontWeight={"medium"}>
          {type === "create" ? "New Vineyard" : "Edit Vineyard"}
        </Typography>

        <Typography variant="body2" className="opacity-75">
          {type === "create" ? "Add a new vineyard" : "Edit existing vineyard"}
        </Typography>
      </Box>

      <VineyardCreateEditForm
        vineyard={vineyard}
        closeDrawer={onClose}
        type={type}
      />
    </EntityFormDrawer>
  );
}
