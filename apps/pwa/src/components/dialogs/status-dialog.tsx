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

interface StatusDialogProps {
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
        sx={({ palette }) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: palette.grey[500],
        })}
      >
        <Close fontSize="small" />
      </IconButton>
      <DialogTitle
        id="edit-note-dialog-title"
        className="flex items-center gap-2"
      >
        <ModeStandby />
        Vineyards Statuses
      </DialogTitle>

      <DialogContent className="min-w-[400px] px-8! py-2!">
        <div
          className="border p-4 rounded-sm"
          style={{
            backgroundColor: "#12121201",
            overflow: "auto",
            borderColor: "var(--mui-palette-divider)",
          }}
        >
          <DialogContentText
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "space-between",
              width: "100%",
              fontWeight: 700,
            }}
          >
            <span>Status</span>
            <span>Vineyards</span>
          </DialogContentText>

          {data.map(({ name, count }) => (
            <DialogContentText
              key={name}
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>{name}</span>
              <span>{count}</span>
            </DialogContentText>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
