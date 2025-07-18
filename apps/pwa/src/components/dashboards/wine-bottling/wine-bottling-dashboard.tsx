"use client";

import BottleFormDrawer from "@/components/drawers/bottle-form-drawer";
// import VineyardFormDrawer from "@/components/drawers/vineyard-form-drawer";
import WineBottlingTable from "@/components/table/wine-bottling";
import ToolsBar from "@/components/widgets/tools-bar";
import { Box, Stack, Typography } from "@mui/material";

export default function WineBottlingDashboard() {
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
        <Typography variant="h4">Wine Bottling</Typography>
        <ToolsBar />
        <WineBottlingTable />
      </Stack>
      <BottleFormDrawer />
    </Box>
  );
}
