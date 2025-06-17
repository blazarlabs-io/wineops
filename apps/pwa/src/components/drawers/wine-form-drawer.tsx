import { FormMode, Wine } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import EntityFormDrawer from "./entity-form-drawer";
import WineForm from "../forms/wine/wine-form";

export type WineFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  wine?: Wine;
  type: FormMode;
};

export default function WineFormDrawer({
  open,
  onClose,
  wine,
  type,
}: WineFormDrawerProps) {
  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Box padding={2} marginTop={4}>
        <Typography variant="h5" fontWeight={"medium"}>
          Buy Wine
        </Typography>

        <Typography variant="body2" className="opacity-75">
          {type === "create" ? "New wine" : "Existing wine"}
        </Typography>
      </Box>

      <WineForm wine={wine} closeDrawer={onClose} type={type} />
    </EntityFormDrawer>
  );
}
