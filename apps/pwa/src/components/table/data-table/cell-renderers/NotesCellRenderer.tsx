import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import NotesDataDisplay from "@/components/data-display/notes-data-display";

export const NotesCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  return (
    <div className="flex items-center w-full h-full">
      {params &&
        params.node.allChildrenCount &&
        params.node.allLeafChildren && (
          <NotesDataDisplay notes={params.node.allLeafChildren[0].data.notes} />
        )}
    </div>
  );
};
