/* eslint-disable @typescript-eslint/no-explicit-any */
import { useVineyard } from "@/context/vineyard";
import { db } from "@/lib/firebase/services";
import { Backup } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import FileUploaderField from "../forms/custom-fields/file-uploader-field";
import { useWinery } from "@/context/winery";

export interface CreateNoteDialogProps {
  open: boolean;
  subject: string;
  uid: string;
  onClose: () => void;
}

export default function UploadDocumentsDialog({
  open,
  subject,
  uid,

  onClose,
}: CreateNoteDialogProps) {
  const { vineyards } = useVineyard();
  const { documents } = useWinery();

  const handleCreateNewNote = async (data: any) => {
    // * 1. Create note in DB
    const teamRes = await db.note.create(uid, data);
    if (teamRes.status === 200) {
      enqueueSnackbar("Note created successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Error creating note", { variant: "error" });
    }

    // * 2. Update vineyard or group to reference new note.
    const subjectVineyard = vineyards.filter(
      (vineyard) => vineyard.name === subject
    )[0];

    console.log("subjectVineyard", subjectVineyard, subject);

    const vineyardRes = await db.vineyard.update(uid, subjectVineyard.id, {
      ...subjectVineyard,
      notes: [
        ...subjectVineyard.notes,
        {
          id: data.id,
          name: data.title,
        },
      ],
    });

    if (vineyardRes.status === 200) {
      enqueueSnackbar("Vineyard updated successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Error updating vineyard", { variant: "error" });
    }

    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="create-team-member-dialog-title"
      aria-describedby="create-team-member-dialog-description"
    >
      <DialogTitle
        id="create-team-member-dialog-title"
        className="flex items-center gap-1"
      >
        <Backup color="primary" />
        Upload Documents
      </DialogTitle>

      <DialogContent className="min-w-[400px] py-[0px]!">
        <DialogContentText id="create-team-member-dialog-description">
          Upload documents to your winery operation.
        </DialogContentText>

        <FileUploaderField path="documents" data={documents} />
        {/* <CreateNoteForm
          teamMembers={teamMembers}
          uid={uid}
          onDataSubmit={handleCreateNewNote}
          onClose={onClose}
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
