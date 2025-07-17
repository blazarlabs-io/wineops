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
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { ReactNode } from "react";

export interface LocationDialogProps {
  open: boolean;
  onClose: () => void;
  data: string[];
  title?: ReactNode;
}

export default function LocationDialog({
  open,
  onClose,
  data,
  title = "Locations",
}: LocationDialogProps) {
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
        <LocationOnOutlinedIcon
          sx={{ fontSize: 20, color: "var(--mui-palette-primary-main)" }}
        />
        {title}
      </DialogTitle>

      <DialogContent className="min-w-[440px]">
        <div
          className="border p-4 rounded-sm"
          style={{
            backgroundColor: "#12121201",
            overflow: "auto",
            borderColor: "var(--mui-palette-divider)",
          }}
        >
          {data.map((d, index) => (
            <DialogContentText key={d + index}>{d || "N/A"}</DialogContentText>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
