import { Note } from "@/models/types/db";
import { Stack, Typography } from "@mui/material";
import { GROUP_ITEMS_TO_SHOW } from "@/data/constants";

export type NotesDataDisplayProps = {
  notes: Note[];
};

export default function NotesDataDisplay({ notes }: NotesDataDisplayProps) {
  return (
    <Stack
      direction="column"
      spacing={0}
      className="justify-center items-start gap-1"
      height={"100%"}
    >
      {notes &&
        notes.length > 0 &&
        notes.map((note, index) => (
          <div
            key={note.id + index}
            style={{
              display: index < GROUP_ITEMS_TO_SHOW ? "flex" : "none",
            }}
            className="w-full min-h-fit flex items-center justify-center"
          >
            {index < 1 && (
              <div className="flex relative flex-col items-start justify-start rounded-md border max-w-fit p-1 min-w-[150px] ">
                <div className="absolute top-0 left-0 w-[4px] h-full bg-[#00C950] rounded-l-md" />
                <Typography
                  variant="body2"
                  className="pl-2 truncate max-w-[140px]"
                >
                  {note.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="pl-2 text-xs truncate max-w-[140px]"
                  color="text.secondary"
                >
                  {note.content}
                </Typography>
              </div>
            )}
          </div>
        ))}
      {notes.length > 1 && (
        <Typography
          color="primary"
          variant="body2"
          className="text-xs underline"
        >
          + {notes.length - GROUP_ITEMS_TO_SHOW} more
        </Typography>
      )}
    </Stack>
  );
}
