import { LabReport } from "@/models/types/db";
import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import LabDataContent from "../widgets/components/lab-data-content";
import { Icon } from "@iconify/react";

interface LabResultsDialogProps {
  open: boolean;
  onClose: () => void;
  data?: LabReport;
}

export default function LabResultsDialog({
  open,
  onClose,
  data,
}: LabResultsDialogProps) {
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
        <Icon
          icon="material-symbols:lab-profile-outline"
          width={18}
          color={"var(--mui-palette-primary-main)"}
        />
        Lab Results
      </DialogTitle>

      <DialogContent className="min-w-[600px]">
        <div
          className="border p-4 rounded-sm"
          style={{
            backgroundColor: "#12121201",
            overflow: "auto",
            borderColor: "var(--mui-palette-divider)",
          }}
        >
          <LabDataContent labData={data} />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
