import { DashboardEntity } from "@/models/types/dashboard";
import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export interface DeleteEntitiesDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  entities: DashboardEntity[];
  entityName?: string;
}

export default function DeleteEntitiesDialog({
  open,
  onClose,
  onDelete,
  entities,
  entityName = "vineyard",
}: DeleteEntitiesDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className="flex items-center gap-1">
        <DeleteOutline color="error" />
        Delete {entityName}(s)
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete these {entityName}(s)?
        </DialogContentText>

        <DialogContentText id="alert-dialog-description">
          <Box display={"flex"} gap={1} flexWrap={"wrap"} paddingTop={2}>
            {entities.map((entity) => (
              <Chip label={entity.name} key={entity.id} />
            ))}
          </Box>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
