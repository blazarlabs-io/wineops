"use client";
import CreateNoteDialog from "@/components/dialogs/create-note-dialog";
import { useWinery } from "@/context/winery";
import { useAuth } from "@/lib/firebase/auth";
import { Add } from "@mui/icons-material";
import { Tooltip, IconButton } from "@mui/material";
import { useState } from "react";

export type NotesWidgetProps = {
  subject: string;
};

export default function NotesWidget({ subject }: NotesWidgetProps) {
  const { user } = useAuth();
  const { teamMembers } = useWinery();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Tooltip title="Create note" arrow>
        <IconButton
          color="default"
          size="small"
          onClick={handleOpen}
          className="max-w-[32px] max-h-[32px]"
        >
          <Add className="max-w-[20px] max-h-[20px]" />
        </IconButton>
      </Tooltip>
      <CreateNoteDialog
        subject={subject}
        open={open}
        uid={user?.uid as string}
        onClose={() => setOpen(false)}
        teamMembers={teamMembers}
      />
    </>
  );
}
