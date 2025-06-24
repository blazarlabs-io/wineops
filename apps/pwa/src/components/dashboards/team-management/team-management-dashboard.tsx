"use client";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import TeamMemberFormDrawer from "@/components/drawers/team-member-form-drawer";
import TeamTable from "@/components/table/team";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { Box, Stack, Typography } from "@mui/material";

export default function TeamMembersPeoplePage() {
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
        <Typography variant="h4">Your Team</Typography>

        <ToolsBar
          buttons={{
            [ButtonType.ADD]: {},
            [ButtonType.EDIT]: {},
            [ButtonType.DELETE]: {},
          }}
        />

        <TeamTable />
      </Stack>

      <TeamMemberFormDrawer />

      <DeleteEntitiesDialog />
    </Box>
  );
}
