import NotesDataDisplay from "@/components/data-display/notes-data-display";
import Stack from "@mui/material/Stack";
import type { CustomCellRendererProps } from "ag-grid-react";

export const NotesCellRenderer = (params: CustomCellRendererProps) => {
  const { value, node, data } = params;
  const isGroup = node.group || data.rowType === "group";

  const localData = Array.isArray(value) ? value[0] : {};

  console.log("NotesCellRenderer:value:", value);
  console.log("NotesCellRenderer:params:", params);

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      {isGroup ||
      (value &&
        Array.isArray(value) &&
        Array.isArray(value[0]) &&
        (!localData ||
          (localData && Array.isArray(localData) && !localData[0]))) ? (
        <></>
      ) : (
        <NotesDataDisplay notes={Array.isArray(localData) ? localData : []} />
      )}
    </Stack>
  );
};
