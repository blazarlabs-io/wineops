import NotesDataDisplay from "@/components/data-display/notes-data-display";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { useAuth } from "@/lib/firebase/auth";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";

export const NotesCellRenderer = (params: CustomCellRendererProps) => {
  const { user } = useAuth();
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      height={ROW_HEIGHT_DEFAULT}
    >
      {isGroup ? (
        <></>
      ) : (
        <NotesDataDisplay
          notes={Array.isArray(value) ? value : []}
          uid={user?.uid as string}
        />
      )}
    </Stack>
  );
};
