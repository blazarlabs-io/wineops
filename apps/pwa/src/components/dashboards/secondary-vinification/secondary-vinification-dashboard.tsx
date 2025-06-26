"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import WineFormDrawer from "@/components/drawers/wine-form-drawer";
import WinesTable from "@/components/table/wines";

export default function SecondaryVinificationDashboard() {
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
        <Typography variant="h4">Secondary Vinification</Typography>

        <ToolsBar
          groupByButtons={[
            { name: "by Vessel Type", columnName: "groupByVesselType" },
            { name: "by Location", columnName: "groupByLocation" },
            { name: "by Status", columnName: "groupByStatus" },
          ]}
        />

        <WinesTable />
      </Stack>

      <WineFormDrawer />
    </Box>
  );
}
