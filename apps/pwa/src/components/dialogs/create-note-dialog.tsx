/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/firebase/services";
import { Role, TeamMember } from "@/models/types/db";
import { EditNote } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import CreateTeamMemberForm from "../forms/team/team-member-create-edit-form";
import CreateNoteForm from "../forms/notes/create-note-form";
import { useVineyard } from "@/context/vineyard";

export interface CreateNoteDialogProps {
  open: boolean;
  subject: string;
  uid: string;
  teamMembers: TeamMember[];
  onClose: () => void;
}

export default function CreateNoteDialog({
  open,
  subject,
  uid,
  teamMembers,
  onClose,
}: CreateNoteDialogProps) {
  const { vineyards } = useVineyard();

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
        <EditNote color="primary" />
        New Note
      </DialogTitle>

      <DialogContent className="min-w-[400px]">
        <DialogContentText id="create-team-member-dialog-description">
          Create a new note for your team or operation.
        </DialogContentText>
        <CreateNoteForm
          teamMembers={teamMembers}
          uid={uid}
          onDataSubmit={handleCreateNewNote}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
