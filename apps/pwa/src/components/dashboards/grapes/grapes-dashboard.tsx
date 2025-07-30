"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import GrapesTable from "@/components/table/grapes";
import GrapeFormDrawer from "@/components/drawers/grape-form-drawer";

export default function GrapesDashboard() {
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
        <Typography variant="h4">Grapes Management</Typography>

        <ToolsBar
          groupByButtons={[
            { name: "by Processing Location", columnName: "groupByLocation" },
            { name: "by Date", columnName: "groupByDate" },
            { name: "by Grape Variety", columnName: "groupByVariety" },
          ]}
        />

        <GrapesTable />
      </Stack>

      <GrapeFormDrawer />
    </Box>
  );
}
