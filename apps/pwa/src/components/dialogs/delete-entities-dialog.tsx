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
  entityName: string;
}

export default function DeleteEntitiesDialog({
  open,
  onClose,
  onDelete,
  entities,
  entityName,
}: DeleteEntitiesDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title" className="flex items-center gap-1">
        <DeleteOutline color="error" />
        Delete {entityName}(s)
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete these {entityName}(s)?
        </DialogContentText>

        <Box display={"flex"} gap={1} flexWrap={"wrap"} paddingTop={2}>
          {entities.map((entity) => (
            <Chip label={entity.name} key={entity.id} />
          ))}
        </Box>
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
