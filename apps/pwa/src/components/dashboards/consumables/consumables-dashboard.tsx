"use client";

import { Box, Stack, Typography } from "@mui/material";
import ToolsBar from "@/components/widgets/tools-bar";
import ConsumableFormDrawer from "@/components/drawers/consumable-form-drawer";
import ConsumablesTable from "@/components/table/consumables";

export default function ConsumablesDashboard() {
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
        <Typography variant="h4">Consumables</Typography>

        <ToolsBar />

        <ConsumablesTable />
      </Stack>

      <ConsumableFormDrawer />
    </Box>
  );
}
