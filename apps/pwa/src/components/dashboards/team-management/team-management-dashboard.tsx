"use client";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import TeamMemberFormDrawer from "@/components/drawers/team-member-form-drawer";
import TeamTable from "@/components/table/team";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { useWinery } from "@/context/winery";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { FormMode, Role, TeamMember } from "@/models/types/db";
import { Box, Stack, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { StrictMode, useState } from "react";

export default function TeamMembersPeoplePage() {
  const { user } = useAuth();
  const { teamMembers, updateSelectedTeamMembers, selectedTeamMembers } =
    useWinery();

  const [openCreateEditTeamMember, setOpenCreateEditTeamMember] =
    useState<boolean>(false);
  const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const handleSelectionChange = (teamMembers: TeamMember[]) => {
    updateSelectedTeamMembers(teamMembers);
  };

  const handleCreateTeeamMember = () => {
    setFormType("create");
    setOpenCreateEditTeamMember(true);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenEditTeamMember = () => {
    setFormType("edit");
    setOpenCreateEditTeamMember(true);
  };

  const handleCloseCreateEditTeamMember = () => {
    setOpenCreateEditTeamMember(false);
  };
  const handleDeleteTeamMembers = async () => {
    console.log("teamMembers", selectedTeamMembers);
    const res = await db.team.deleteMany(
      user?.uid as string,
      selectedTeamMembers.map(({ id }) => id)
    );

    if (res.status === 200) {
      updateSelectedTeamMembers([]);

      enqueueSnackbar(`Team member(s) deleted successfully`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Error deleting team member(s)`, {
        variant: "error",
      });
    }
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
                onClick: handleOpenEditTeamMember,
              },
              [ButtonType.DELETE]: {
                enabled: selectedTeamMembers.length > 0,
                onClick: handleOpenDeleteDialog,
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
      {openCreateEditTeamMember && (
        <TeamMemberFormDrawer
          type={formType}
          member={
            selectedTeamMembers.length === 1
              ? selectedTeamMembers[0]
              : ({} as TeamMember)
          }
          roles={Object.values(Role)}
          open={openCreateEditTeamMember}
          onClose={handleCloseCreateEditTeamMember}
        />
      )}

      <DeleteEntitiesDialog
        entityName="team member"
        entities={selectedTeamMembers}
        open={openDeleteDialog}
        onDelete={handleDeleteTeamMembers}
        onClose={handleCloseDeleteDialog}
      />
    </Box>
  );
}
