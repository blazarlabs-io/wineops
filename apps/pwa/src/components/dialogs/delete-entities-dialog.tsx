import { DashboardEntity } from "@/models/types/dashboard";
import { Task, TeamMember } from "@/models/types/db";
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
  entities: DashboardEntity[] | TeamMember[] | Task[];
  entityName: string;
}

export default function DeleteEntitiesDialog({
  open,
  onClose,
  onDelete,
  entities,
  entityName,
}: DeleteEntitiesDialogProps) {
  console.log(entities);

  function getEntityNameAndId(entity: DashboardEntity | TeamMember | Task) {
    if ("name" in entity) {
      return { name: entity.name, id: entity.id };
    } else {
      return { name: entity.title, id: entity.id };
    }
  }

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
          {entities.map((entity) => {
            const { name, id } = getEntityNameAndId(entity);
            return <Chip label={name} key={id} />;
          })}
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
