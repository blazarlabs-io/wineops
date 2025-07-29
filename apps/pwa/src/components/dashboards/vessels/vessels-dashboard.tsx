"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import VesselTable from "@/components/table/vessel";
import VesselFormDrawer from "@/components/drawers/vessel-form-drawer";

export default function VesselsDashboard() {
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
        <Typography variant="h4">Vessel Management</Typography>

        <ToolsBar />

        <VesselTable />
      </Stack>

      <VesselFormDrawer />
    </Box>
  );
}
