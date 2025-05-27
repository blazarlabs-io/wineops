import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import NotesDataDisplay from "@/components/data-display/notes-data-display";
import { Box } from "@mui/material";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";

export const NotesCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
      height={ROW_HEIGHT_DEFAULT}
    >
      {!params.node.group && (
        <div className="flex items-center w-full h-full">
          <NotesDataDisplay notes={params.value} />
        </div>
      )}
    </Box>
  );
};
