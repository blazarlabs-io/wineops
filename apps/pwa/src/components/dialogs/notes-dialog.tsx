import { db } from "@/lib/firebase/services";
import { Note } from "@/models/types/db";
import { EditNote } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import EditNoteForm from "../forms/notes/edit-note-form";

export interface NotesDialogProps {
  open: boolean;
  uid: string;
  onClose: () => void;
  notes: Note[];
}

export default function NotesDialog({
  open,
  uid,
  notes,
  onClose,
}: NotesDialogProps) {
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
        Notes
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
          {notes.map((note) => (
            <div key={note.id} className="flex items-center gap-2 w-full">
              <DialogContentText
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr auto",
                  gap: 4,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="body1" fontWeight={"bold"}>
                  {note.title}
                </Typography>
                <Typography variant="body2">{note.content}</Typography>
                <Avatar
                  src={note.author?.avatar}
                  sx={{ width: 18, height: 18 }}
                >
                  <span className="text-xs">
                    {note.author?.name?.charAt(0)}
                  </span>
                </Avatar>
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
