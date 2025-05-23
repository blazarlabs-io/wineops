import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import NotesDataDisplay from "@/components/data-display/notes-data-display";

export const NotesCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  return (
    <>
      {!params.node.group && (
        <div className="flex items-center w-full h-full">
          <NotesDataDisplay notes={params.value} />
        </div>
      )}
    </>
  );
};
