import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Vineyard } from "@/models/types/db";
import DeselectIcon from "@mui/icons-material/Deselect";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

type UngroupingDialogProps<T> = {
  open: boolean;
  rows: T[];
  onClose: () => void;
  onUngroup: () => void;
};

export default function UngroupingDialog<T extends Vineyard>({
  open,
  rows,
  onClose,
  onUngroup,
}: UngroupingDialogProps<T>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleUngroup = () => {
    onUngroup();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby="ungrouping-dialog-title"
      sx={{
        "& .MuiDialog-paper": {
          minWidth: "375px",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="ungrouping-dialog-title">
        <DeselectIcon color="primary" sx={{ mr: 2 }} />
        Ungrouping
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          top: 8,
          right: 8,
          position: "absolute",
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          Are you sure you want to ungroup the following items?
        </Typography>
          <Stack px={2} gap={1}>
          {rows.map(({ id, name }, index) => (
            <Typography key={id} variant="body2">
              {index + 1}. {name}
            </Typography>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Tooltip title="Ungroup" arrow>
          <Button
            autoFocus
            variant="contained"
            id="ungroup"
            name="ungroup"
            aria-label="ungroup"
            className="shadow-xs"
            onClick={handleUngroup}
          >
            Ungroup
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
