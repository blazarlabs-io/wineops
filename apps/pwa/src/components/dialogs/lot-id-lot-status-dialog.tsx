import { Close } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Grape } from "lucide-react";
import { ReactNode } from "react";

export interface LotIdAndLotStatusDialogProps {
  open: boolean;
  onClose: () => void;
  ids: string[];
  statuses: string[];
  title?: ReactNode;
}

export default function LotIdAndLotStatusDialog({
  open,
  onClose,
  ids,
  statuses,
  title = "Lot ID and Lot Status",
}: LotIdAndLotStatusDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        size="small"
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <Close fontSize="small" />
      </IconButton>
      <DialogTitle
        id="edit-note-dialog-title"
        className="flex items-center gap-2"
      >
        <Grape size={18} color={"var(--mui-palette-primary-main)"} />
        {title}
      </DialogTitle>

      <DialogContent className="min-w-[440px]">
        <div
          className="border p-4 rounded-sm flex items start justify-start flex-col gap-2"
          style={{
            backgroundColor: "#12121201",
            overflow: "auto",
            borderColor: "var(--mui-palette-divider)",
          }}
        >
          {ids.map((id, index) => (
            <div key={id + index} className="flex items-center gap-2">
              <DialogContentText variant="body2">{id}</DialogContentText>
              <Chip size="small" label={statuses[index]} className="text-xs!" />
            </div>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
