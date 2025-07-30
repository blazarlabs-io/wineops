import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Grape } from "lucide-react";

interface GrapeVarietyDialogProps {
  open: boolean;
  onClose: () => void;
  data: string[];
}

export default function GrapeVarietyDialog({
  open,
  onClose,
  data,
}: GrapeVarietyDialogProps) {
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
        Grape Variety
      </DialogTitle>

      <DialogContent className="min-w-[400px]">
        <div
          className="border p-4 rounded-sm"
          style={{
            backgroundColor: "#12121201",
            overflow: "auto",
            borderColor: "var(--mui-palette-divider)",
          }}
        >
          {data.map((variety) => (
            <DialogContentText key={variety}>{variety}</DialogContentText>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
