import type { CustomCellRendererProps } from 'ag-grid-react';
import { type FunctionComponent } from 'react';

import NotesDataDisplay from '@/components/data-display/notes-data-display';

export const NotesCellRenderer: FunctionComponent<CustomCellRendererProps> = ({ value }) => {
  return (
    <div className="flex items-center w-full h-full">
      {value && <NotesDataDisplay notes={value} />}
    </div>
  );
};
