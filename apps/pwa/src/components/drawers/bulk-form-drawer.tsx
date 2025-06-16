import { FormMode, Bulk } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import EntityFormDrawer from "./entity-form-drawer";
import BulkForm from "../forms/bulk/bulk-form";

export type BulkFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  bulk?: Bulk;
  type: FormMode;
};

export default function BulkFormDrawer({
  open,
  onClose,
  bulk,
  type,
}: BulkFormDrawerProps) {
  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Box padding={2} marginTop={4}>
        <Typography variant="h5" fontWeight={"medium"}>
          {type === "create" ? "New Bulk" : "Edit Bulk"}
        </Typography>

        <Typography variant="body2" className="opacity-75">
          {type === "create" ? "Add a new bulk" : "Edit existing bulk"}
        </Typography>
      </Box>

      <BulkForm bulk={bulk} closeDrawer={onClose} type={type} />
    </EntityFormDrawer>
  );
}
