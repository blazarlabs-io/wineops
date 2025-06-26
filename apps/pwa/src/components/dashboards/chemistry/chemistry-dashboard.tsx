"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import ChemistryFormDrawer from "@/components/drawers/chemistry-form-drawer";
import ChemistryTable from "@/components/table/chemistry";

export default function ChemistryDashboard() {
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
        <Typography variant="h4">Chemistry</Typography>

        <ToolsBar groupByButtons={[{ name: "by Type", columnName: "type" }]} />

        <ChemistryTable />
      </Stack>

      <ChemistryFormDrawer />
    </Box>
  );
}
