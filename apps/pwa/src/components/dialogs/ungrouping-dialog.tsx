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
import { DashboardEntity } from "@/models/types/dashboard";
import EntityChip from "./entity-chip";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import { useDialogDrawerStore } from "@/store/dialogs";

type UngroupingDialogProps<T> = {
  onUngroup: (selected: T[]) => void;
};

export default function UngroupingDialog<T extends DashboardEntity>({
  onUngroup,
}: UngroupingDialogProps<T>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const selected = useSelectedEntitiesStore(({ selected }) => selected);

  const { dialogs, closeDialog } = useDialogDrawerStore((state) => state);
  const open = dialogs["ungroup-entities"];
  const onClose = () => closeDialog("ungroup-entities");

  const handleUngroup = () => {
    onUngroup(selected as T[]);
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
          {selected.map((row) => (
            <EntityChip
              row={row}
              key={`${row.id}-${row["vesselId" as keyof DashboardEntity] || ""}`}
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
