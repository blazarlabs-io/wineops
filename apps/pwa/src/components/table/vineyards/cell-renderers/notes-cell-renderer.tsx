import type { CustomCellRendererProps } from "ag-grid-react";
import { useState, type FunctionComponent } from "react";

import NotesWidget from "@/components/widgets/notes";
import { ROW_HEIGHT_DEFAULT } from "@/data/constants";
import { Box } from "@mui/material";
import { useVineyard } from "@/context/vineyard";
import { useGetVineyardNotes } from "@/hooks/use-get-vineyard-notes";
import { useAuth } from "@/lib/firebase/auth";
import NotesDataDisplay from "@/components/data-display/notes-data-display";

export const NotesCellRenderer: FunctionComponent<CustomCellRendererProps> = (
  params
) => {
  const { notes } = useVineyard();
  const { user } = useAuth();
  const { vineyardNotes } = useGetVineyardNotes(
    user?.uid as string,
    params.node.data,
    notes
  );
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box
      height={ROW_HEIGHT_DEFAULT}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center justify-start w-full gap-2"
    >
      <NotesDataDisplay notes={vineyardNotes} uid={user?.uid as string} />
      {isHovered && <NotesWidget subject={params.node.key as string} />}
    </Box>
  );
};
