import { Vineyard } from "@/models/types/db";
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

export interface DeleteVineyardsDialogProps {
  open: boolean;
  onClose: () => void;
  vineyards: Vineyard[];
}

export default function DeleteVineyardsDialog({
  open,
  onClose,
  vineyards,
}: DeleteVineyardsDialogProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className="flex items-center gap-1">
        <DeleteOutline color="error" />
        Delete Vineyard(s)
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete these vineyard(s)?
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          <Box display={"flex"} gap={1} flexWrap={"wrap"} paddingTop={2}>
            {vineyards.map((vineyard) => (
              <Chip label={vineyard.name} key={vineyard.id} />
            ))}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}
