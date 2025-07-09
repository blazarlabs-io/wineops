"use client";

import VineyardFormDrawer from "@/components/drawers/vineyard-form-drawer";
import VineyardsTable from "@/components/table/vineyards";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { Box, Stack, Typography } from "@mui/material";

export default function VineyardsDashboard() {
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
        <Typography variant="h4">Vineyards Management</Typography>
        <ToolsBar />
        <VineyardsTable />
      </Stack>
      <VineyardFormDrawer />
    </Box>
  );
}
