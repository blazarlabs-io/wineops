"use client";

import { DataTable } from "@/components/table/data-table";
import ToolsBar from "@/components/widgets/tools-bar";
import { Box, useColorScheme } from "@mui/material";

export default function WorkspacePage() {
  const { mode } = useColorScheme();

  return (
    <Box className="flex w-full h-">
      <Box className="flex flex-col gap-4 w-full">
        <ToolsBar />
        <DataTable isDarkMode={mode === "dark"} />
      </Box>
    </Box>
  );
}
