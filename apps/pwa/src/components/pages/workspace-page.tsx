"use client";

import { DataTable } from "@/components/table/data-table";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { Vineyard } from "@/models/types/db";
import { Box, useColorScheme } from "@mui/material";
import { useState } from "react";

export default function WorkspacePage() {
  const { mode } = useColorScheme();

  const [selectionData, setSelectionData] = useState<Vineyard[]>([]);

  const { enableEdit, enableGrouping, enableDelete } =
    useSortToolsBarStates(selectionData);

  return (
    <Box className="flex w-full h-full">
      <Box className="flex flex-col gap-4 w-full">
        <ToolsBar
          enableCreate={true}
          enableEdit={enableEdit}
          enableGrouping={enableGrouping}
          enableDelete={enableDelete}
        />
        <DataTable
          isDarkMode={mode === "dark"}
          onChangeData={setSelectionData}
        />
      </Box>
    </Box>
  );
}
