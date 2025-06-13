import { db } from "@/lib/firebase/services";
import { Note } from "@/models/types/db";
import { EditNote } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import EditNoteForm from "../forms/notes/edit-note-form";

export interface CreateNoteDialogProps {
  open: boolean;
  uid: string;
  onClose: () => void;
  note: Note;
}

export default function EditNoteDialog({
  open,
  uid,
  note,
  onClose,
}: CreateNoteDialogProps) {
  const handleEditNote = async (data: Note) => {
    // * 1. Update note in DB
    const teamRes = await db.note.update(uid, data);
    if (teamRes.status === 200) {
      enqueueSnackbar("Note created successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Error creating note", { variant: "error" });
    }

    onClose();
  };

  const handleDeleteNote = async (note: Note) => {
    // * 1. Update note in DB
    const teamRes = await db.note.delete(uid, note.id);
    if (teamRes.status === 200) {
      enqueueSnackbar("Note deleted successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Error deleting note", { variant: "error" });
    }

    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-note-dialog-title"
      aria-describedby="create-note-dialog-description"
    >
      <DialogTitle
        id="edit-note-dialog-title"
        className="flex items-center gap-1"
      >
        <EditNote color="primary" />
        Edit Note
      </DialogTitle>

      <DialogContent className="min-w-[400px]">
        <DialogContentText id="edit-note-dialog-description">
          Edit existing note for your team or operation.
        </DialogContentText>
        <EditNoteForm
          note={note}
          onDataSubmit={handleEditNote}
          onClose={onClose}
          onDelete={handleDeleteNote}
        />
      </DialogContent>
    </Dialog>
  );
}
