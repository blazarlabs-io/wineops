"use client";
import CreateTeamMemberDialog from "@/components/dialogs/create-team-member-dialog";
import TeamTable from "@/components/table/team";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { useWinery } from "@/context/winery";
import { useAuth } from "@/lib/firebase/auth";
import { TeamMember } from "@/models/types/db";
import { Box, Stack, Typography } from "@mui/material";
import { StrictMode, useState } from "react";

export default function TeamMembersPeoplePage() {
  const { user } = useAuth();
  const { teamMembers, updateSelectedTeamMembers, selectedTeamMembers } =
    useWinery();

  const [openCreateTeamMember, setOpenCreateTeamMember] =
    useState<boolean>(false);

  const handleSelectionChange = (teamMembers: TeamMember[]) => {
    updateSelectedTeamMembers(teamMembers);
  };

  const handleCreateTeeamMember = () => {
    setOpenCreateTeamMember(true);
  };
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
        <div className="flex flex-col gap-6">
          <ToolsBar
            buttons={{
              [ButtonType.ADD]: {
                enabled: selectedTeamMembers.length === 0,
                onClick: handleCreateTeeamMember,
              },
              [ButtonType.EDIT]: {
                enabled: selectedTeamMembers.length === 1,
                onClick: () => {},
              },
              [ButtonType.DELETE]: {
                enabled: selectedTeamMembers.length > 0,
                onClick: () => {},
              },
            }}
          />
          <Box width={"100%"} height={"100%"}>
            <StrictMode>
              <TeamTable
                data={teamMembers as TeamMember[]}
                onSelectionChange={handleSelectionChange}
              />
            </StrictMode>
          </Box>
        </div>
      </Stack>
      <CreateTeamMemberDialog
        open={openCreateTeamMember}
        uid={user?.uid as string}
        onClose={() => setOpenCreateTeamMember(false)}
      />
    </Box>
  );
}
