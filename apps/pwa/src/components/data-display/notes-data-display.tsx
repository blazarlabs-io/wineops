import { GROUP_ITEMS_TO_SHOW } from "@/data/constants";
import { Note } from "@/models/types/db";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import EditNoteDialog from "../dialogs/edit-note-dialog";
import NotesDialog from "../dialogs/notes-dialog";

export type NotesDataDisplayProps = {
  notes: Note[];
  uid: string;
};

export default function NotesDataDisplay({
  notes,
  uid,
}: NotesDataDisplayProps) {
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openNotesDialog, setOpenNotesDialog] = useState<boolean>(false);
  const [editNote, setEditNote] = useState<Note | null>(null);

  if (!notes) return;

  const handleNoteOpen = (note: Note) => {
    setEditNote(note);
    setOpenEditDialog(true);
  };

  const handleOpenNotesDialog = () => {
    setOpenNotesDialog(true);
  };

  return (
    <>
      <Stack
        direction="column"
        spacing={0}
        className="justify-center items-start gap-1 max-w-[200px]"
        height={"100%"}
      >
        {notes &&
          notes.length > 0 &&
          notes.map((note, index) => (
            <div
              onClick={() => handleNoteOpen(note)}
              key={note?.id + index}
              style={{
                display: index < 1 ? "flex" : "none",
              }}
              className="w-full min-h-fit flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all duration-200 ease-in-out"
            >
              {index < 1 && (
                <div className="flex relative flex-col items-start justify-start rounded-md border max-w-fit p-1 min-w-[150px] ">
                  <div className="absolute top-0 left-0 w-[4px] h-full bg-[#00C950] rounded-l-md" />
                  <div className="flex items-center justify-between w-full">
                    <Typography
                      variant="body2"
                      className="pl-2 truncate max-w-[140px]"
                    >
                      {note?.title}
                    </Typography>
                    <Avatar
                      sx={{ width: 18, height: 18 }}
                      className=""
                      alt="Remy Sharp"
                      src={note?.author?.avatar}
                    >
                      <Typography className="" variant="caption">
                        {note?.author?.name.charAt(0)}
                      </Typography>
                    </Avatar>
                  </div>
                  <Typography
                    variant="body2"
                    className="pl-2 text-xs truncate max-w-[140px]"
                    color="text.secondary"
                  >
                    {note?.content}
                  </Typography>
                </div>
              )}
            </div>
          ))}
        {notes.length > 1 && (
          <Button size="small" variant="text" onClick={handleOpenNotesDialog}>
            <Typography
              color="primary"
              variant="body2"
              className="text-xs underline lowercase"
            >
              + {notes.length - 1} more
            </Typography>
          </Button>
        )}
      </Stack>
      <EditNoteDialog
        open={openEditDialog}
        note={editNote as Note}
        uid={uid}
        onClose={() => setOpenEditDialog(false)}
      />
      <NotesDialog
        open={openNotesDialog}
        notes={notes as Note[]}
        uid={uid}
        onClose={() => setOpenNotesDialog(false)}
      />
    </>
  );
}
