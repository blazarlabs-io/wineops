import type { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useState, type FunctionComponent } from "react";

import NotesWidget from "@/components/widgets/notes";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box } from "@mui/material";
import { useVineyard } from "@/context/vineyard";
import { useGetVineyardNotes } from "@/hooks/use-get-vineyard-notes";
import { useAuth } from "@/lib/firebase/auth";
import NotesDataDisplay from "@/components/data-display/notes-data-display";
import { Note } from "@/models/types/db";

export const NotesCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params,
) => {
  const { notes } = useVineyard();
  const { user } = useAuth();
  const { vineyardNotes } = useGetVineyardNotes(
    user?.uid as string,
    params.node.data,
    notes,
  );

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isClicked) setIsHovered(false);
  }, [isClicked]);

  const handleAddClicked = useCallback(() => {
    setIsClicked(true);
  }, []);

  const handleCloseAll = useCallback(() => {
    setIsHovered(false);
    setIsClicked(false);
  }, []);

  return (
    <Box
      height={ROW_HEIGHT_DEFAULT}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center justify-start w-full gap-2"
    >
      <NotesDataDisplay
        notes={vineyardNotes as Note[]}
        uid={user?.uid as string}
      />
      {isHovered && (
        <NotesWidget
          subject={params.node.key as string}
          onClick={handleAddClicked}
          onClose={handleCloseAll}
        />
      )}
    </Box>
  );
};
