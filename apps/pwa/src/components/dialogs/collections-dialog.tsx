
import { Icon } from "@iconify/react/dist/iconify.js";
import { Close } from "@mui/icons-material";
import {
  Button,
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

interface CadastralDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
  title?: ReactNode;
}

export default function CollectionsDialog({
  open,
  onClose,
  data,
  title = "Collections",
}: CadastralDialogProps) {
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
          className="border p-4 rounded-sm"
          style={{
            backgroundColor: "#12121201",
            overflow: "auto",
            borderColor: "var(--mui-palette-divider)",
          }}
        >
          {data.map((_data: any, index: number) => (
            <div
              key={index + _data.id}
              className="grid grid-cols-2 items-center"
            >
              <DialogContentText color="textPrimary">
                {_data.name}
              </DialogContentText>
              <div className="flex items-center gap-1">
                <Icon icon="formkit:date" width="12" height="12" />
                <DialogContentText color="textSecondary">
                  {_data.vintage}
                </DialogContentText>
              </div>
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
