import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { DashboardEntity } from "@/models/types/dashboard";
import { EntitiesNames, Task, TeamMember } from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedEntitiesStore } from "@/store/selected-entities";
import getUnusedGroups from "@/utils/get-unused-groups";
import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";

type DeleteEntitiesDialogProps<T> = {
  data?: T[];
};

export default function DeleteEntitiesDialog<T extends DashboardEntity>({
  data = [],
}: DeleteEntitiesDialogProps<T>) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { selected, setSelected, entityName } = useSelectedEntitiesStore(
    (state) => state,
  );

  const { dialogs, close } = useDialogDrawerStore((state) => state);
  const isOpen = dialogs["delete-entities"];
  const onClose = () => close("delete-entities");

  const [one, many] = EntitiesNames[entityName];

  const handleDelete = async () => {
    if (!entityName || !db[entityName]) return;

    const rows2Delete = [
      ...selected.map((row) => ({ ...row, group: [row.name] })),
    ];

    const updatedMap = new Map(rows2Delete.map((row) => [row.id, row]));

    const allRows = data.map(
      (row) =>
        (updatedMap.has(row.id)
          ? updatedMap.get(row.id)
          : row) as DashboardEntity,
    );

    const unusedGroups = getUnusedGroups(allRows);

    const updatedRows2Delete = [...rows2Delete, ...unusedGroups].map(
      ({ id }) => id,
    );

    onClose();

    const res = await db[entityName].deleteMany(
      user?.uid as string,
      updatedRows2Delete,
    );

    if (res.status === 200) {
      setSelected([]);

      enqueueSnackbar(
        `${selected?.length > 1 ? many : one} deleted successfully`,
        {
          variant: "success",
        },
      );
    } else {
      enqueueSnackbar(`Error deleting ${selected?.length > 1 ? many : one}`, {
        variant: "error",
      });
    }
  };

  function getEntityNameAndId(entity: DashboardEntity | TeamMember | Task) {
    if ("name" in entity) {
      return { name: entity.name, id: entity.id };
    } else {
      return { name: entity.title, id: entity.id };
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title" className="flex items-center gap-1">
        <DeleteOutline color="error" />
        Delete {selected?.length > 1 ? many : one}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete{" "}
          {selected?.length > 1 ? `these ${many}` : `this ${one}`}?
        </DialogContentText>

        <Box display={"flex"} gap={1} flexWrap={"wrap"} paddingTop={2}>
          {selected.map((entity) => {
            const { name, id } = getEntityNameAndId(entity);
            return name && <Chip label={name} key={id} />;
          })}
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
