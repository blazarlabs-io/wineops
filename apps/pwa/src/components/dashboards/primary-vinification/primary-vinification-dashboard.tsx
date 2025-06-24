"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import MustFormDrawer from "@/components/drawers/must-form-drawer";
import MustsTable from "@/components/table/musts";

export default function PrimaryVinificationDashboard() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          alignItems: "left",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4">Primary Vinification</Typography>

        <ToolsBar />

        <MustsTable />
      </Stack>

      <MustFormDrawer />
    </Box>
  );
}
