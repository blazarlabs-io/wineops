import { SortedVineyardStatus } from "@/hooks/use-sort-vineyard-statuses";
import { Close, ModeStandby } from "@mui/icons-material";
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

export interface StatusDialogProps {
  open: boolean;
  onClose: () => void;
  data: SortedVineyardStatus[];
}

export default function StatusDialog({
  open,
  onClose,
  data,
}: StatusDialogProps) {
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
        <ModeStandby />
        Vineyard Status
      </DialogTitle>

      <DialogContent className="min-w-[400px] px-8! py-2!">
        <div
          className="border p-4 rounded-sm"
          style={{
            backgroundColor: "#12121222",
            overflow: "auto",
            borderColor: "var(--mui-palette-divider)",
          }}
        >
          {data.map((variety) => (
            <div key={variety.name} className="flex items-center gap-2 w-full">
              <DialogContentText
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>{variety.name}</span>
                <span>{variety.count}</span>
              </DialogContentText>
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
