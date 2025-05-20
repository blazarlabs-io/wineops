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
import DeselectIcon from "@mui/icons-material/Deselect";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Chip } from "@mui/material";
import { DashboardEntity } from "@/models/types/dashboard";

type UngroupingDialogProps<T> = {
  open: boolean;
  rows: T[];
  onClose: () => void;
  onUngroup: () => void;
};

export default function UngroupingDialog<T extends DashboardEntity>({
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
        <DeselectIcon color="action" sx={{ mr: 2 }} />
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
        <Stack px={0} gap={1} marginTop={2} direction="row" flexWrap="wrap">
          {rows.map(({ id, name }) => (
            <Chip
              key={id}
              variant="outlined"
              label={name}
              className="max-w-fit"
            />
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
            onClick={handleUngroup}
          >
            Ungroup
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
