"use client";

import { Add, SwapVert, Tune } from "@mui/icons-material";
import { Box, Button, useColorScheme } from "@mui/material";
import { Search } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import PersistentDrawerLeft from "@/components/widgets/quick-tasks";

export default function WorkspacePage() {
  const { mode } = useColorScheme();

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "hidden",
      }}
    >
      {/* <DemoTable /> */}
      <div className="flex items-center justify-between w-full">
        <Button variant="text" className="min-w-10 min-h-10 max-w-10 max-h-10">
          <Add />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="text"
            className="min-w-10 min-h-10 max-w-10 max-h-10"
          >
            <Tune />
          </Button>
          <Button
            variant="text"
            className="min-w-10 min-h-10 max-w-10 max-h-10"
          >
            <SwapVert />
          </Button>
          <Button
            variant="text"
            className="min-w-10 min-h-10 max-w-10 max-h-10"
          >
            <Search />
          </Button>
        </div>
      </div>
      <DataTable isDarkMode={mode === "dark"} />
      {/* <PersistentDrawerLeft /> */}
    </Box>
  );
}
