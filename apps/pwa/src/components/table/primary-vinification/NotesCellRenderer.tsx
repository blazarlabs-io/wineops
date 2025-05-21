import NotesDataDisplay from "@/components/data-display/notes-data-display";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";

export const NotesCellRenderer = ({ value }: CustomCellRendererProps) => {
  const data = Array.isArray(value) ? value[0] : {};

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      {value &&
      Array.isArray(value) &&
      Array.isArray(value[0]) &&
      (!data || (data && Array.isArray(data) && !data[0])) ? (
        <></>
      ) : (
        <NotesDataDisplay notes={Array.isArray(data) ? data : []} />
      )}
    </Stack>
  );
};
