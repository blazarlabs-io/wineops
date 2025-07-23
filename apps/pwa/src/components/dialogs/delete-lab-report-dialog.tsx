/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { DashboardEntity } from "@/models/types/dashboard";
import { EntitiesNames, EntityName, LabReport } from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedItemsStore } from "@/store/selected-items";
import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import LabReportResponsibleDataDisplay from "../data-display/lab-report-responsible-data-display";

type DeleteLabReportDialogProps<T> = {
  onDelete: (data: any[]) => void;
};

export default function DeleteLabReportDialog<T extends DashboardEntity>({
  onDelete,
}: DeleteLabReportDialogProps<T>) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { selectedItems, setSelectedItems, itemType } = useSelectedItemsStore(
    (state) => state
  );

  const { dialogs, close } = useDialogDrawerStore((state) => state);
  const isOpen =
    dialogs["delete-entity-data"] &&
    itemType === ("labReport" as unknown as EntityName);
  const onClose = () => close("delete-entity-data");

  const [one, many] = EntitiesNames[itemType];

  const handleDelete = async () => {
    if (!itemType || !db[itemType]) return;
    onClose();

    const res = await db[itemType].deleteMany(
      user?.uid as string,
      selectedItems.map(({ id }) => id)
    );

    if (res.status === 200) {
      onDelete(selectedItems);

      setSelectedItems([]);

      enqueueSnackbar(
        `${selectedItems?.length > 1 ? many : one} deleted successfully`,
        {
          variant: "success",
        }
      );
    } else {
      enqueueSnackbar(
        `Error deleting ${selectedItems?.length > 1 ? many : one}`,
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title" className="flex items-center gap-1">
        <DeleteOutline color="error" />
        Delete {selectedItems?.length > 1 ? many : one}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete{" "}
          {selectedItems?.length > 1 ? `these ${many}` : `this ${one}`}?
        </DialogContentText>

        <Box
          display={"flex"}
          gap={1}
          flexWrap={"wrap"}
          paddingTop={2}
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ width: "300px" }}>
            <LabReportResponsibleDataDisplay
              data={selectedItems[0] as unknown as LabReport}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
