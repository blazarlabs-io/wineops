/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { ActionRelation } from "@/models/types/actions";
import { EntitiesNames, EntityName, UploadedDocument } from "@/models/types/db";
import { useDialogDrawerStore } from "@/store/dialogs";
import { useSelectedItemsStore } from "@/store/selected-items";
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
import { Timestamp } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";

export default function DeleteUploadedDialog() {
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { selectedItems, setSelectedItems, itemType } = useSelectedItemsStore(
    (state) => state,
  );

  const { dialogs, close } = useDialogDrawerStore((state) => state);
  const isOpen =
    dialogs["delete-entity-data"] &&
    itemType === ("document" as unknown as EntityName);
  const onClose = useCallback(() => close("delete-entity-data"), [close]);

  const [one, many] = EntitiesNames[itemType];
  const fileToDelete = selectedItems[0] as UploadedDocument;

  const {
    name,
    type,
    vineyardId = "",
    mustId = "",
    actionId = "",
    actions = [],
  } = fileToDelete?.row || {};

  const entityId = vineyardId || mustId;
  const entityName = vineyardId ? "vineyard" : mustId ? "must" : "";

  const handleDeleteFile = useCallback(async () => {
    if (!itemType || !fileToDelete || !name) return;

    const path = type ? type.split(" ").join("-") : "documents";

    if (!path) return;

    setIsDeleting(true);

    const allRows = fileToDelete?.api
      ? fileToDelete.api
          .getAllRowIds()
          .map((id: string) => fileToDelete.api.getRow(id))
      : [];

    try {
      const deleteFileRes = await db.storage.deleteFile(user?.uid, path, name);

      if (user?.uid && actionId && entityId && entityName) {
        const actionDocuments = allRows
          ?.filter(
            (row: any) =>
              row.name !== name &&
              row.type === type &&
              row.actionId === actionId,
          )
          .map(({ name, url }: any) => ({
            name,
            url,
          }));

        const actionRes = await db.action.update(user?.uid, actionId, {
          supportingDocuments: actionDocuments,
        });

        const entityRes = await db["entityName"].update(user?.uid, entityId, {
          actions: actions.map((action: ActionRelation) =>
            action.id === actionId
              ? { ...action, updatedAt: Timestamp.now() }
              : action,
          ),
        });

        if (
          entityRes.status === 200 &&
          actionRes.status === 200 &&
          deleteFileRes.status === 200
        ) {
          enqueueSnackbar("File deleted", { variant: "success" });
        } else {
          enqueueSnackbar("File deletion failed", { variant: "error" });
        }
      }

      if (user?.uid && entityId && entityName && !actionId) {
        const entityDocuments = allRows
          ?.filter(
            (row: any) =>
              row.name !== name &&
              !type &&
              ((vineyardId && row.vineyardId === entityId) ||
                (mustId && row.mustId === entityId)),
          )
          .map(({ id, name, fileUrl, owner, uploadDate }: any) => ({
            id,
            name,
            fileUrl,
            owner,
            uploadDate,
          }));

        const entityRes = await db[entityName].update(user?.uid, entityId, {
          documents: entityDocuments,
        });

        if (entityRes.status === 200 && deleteFileRes.status === 200) {
          enqueueSnackbar("File deleted", { variant: "success" });
        } else {
          enqueueSnackbar("File deletion failed", { variant: "error" });
        }
      }
    } catch (e) {
    } finally {
      onClose();
      setIsDeleting(false);
      setSelectedItems([]);
    }
  }, [
    actionId,
    actions,
    enqueueSnackbar,
    entityId,
    entityName,
    fileToDelete,
    itemType,
    mustId,
    name,
    onClose,
    setSelectedItems,
    type,
    user?.uid,
    vineyardId,
  ]);

  if (!selectedItems || selectedItems?.length === 0 || !fileToDelete) return;

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
          <Box sx={{ width: "100%" }}>
            <Chip label={fileToDelete?.name} />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteFile}
          disabled={isDeleting}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
