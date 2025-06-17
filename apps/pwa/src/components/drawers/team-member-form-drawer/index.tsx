/* eslint-disable @typescript-eslint/no-explicit-any */
import TeamMemberCreateEditForm from "@/components/forms/team/team-member-create-edit-form";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { FormMode, Role, TeamMember } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import EntityFormDrawer from "../entity-form-drawer";

export type TeamMemberFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  member: TeamMember;
  type: FormMode;
  roles: Role[];
};

export default function TeamMemberFormDrawer({
  open,
  onClose,
  member,
  type,
  roles,
}: TeamMemberFormDrawerProps) {
  const { user } = useAuth();

  const handleCreateNewTeamMember = async (data: any) => {
    if (type === "create") {
      const teamRes = await db.team.create(user?.uid, data);

      if (teamRes.status === 200) {
        enqueueSnackbar("Team member created successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Error creating team member", { variant: "error" });
      }
    } else if (type === "edit") {
      const teamRes = await db.team.update(user?.uid, data);

      if (teamRes.status === 200) {
        enqueueSnackbar("Team member updated successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Error updating team member", { variant: "error" });
      }
    }

    onClose();
  };

  return (
    <EntityFormDrawer open={open} onClose={onClose}>
      <Box padding={2} marginTop={4}>
        <Typography variant="h5" fontWeight={"medium"}>
          {type === "create" ? "New Team Member" : "Edit Team Member"}
        </Typography>

        <Typography variant="body2" className="opacity-75">
          {type === "create"
            ? "Add a new team member"
            : "Edit existing team member"}
        </Typography>
      </Box>

      <TeamMemberCreateEditForm
        type={type}
        member={member as TeamMember}
        onDataSubmit={handleCreateNewTeamMember}
        roles={roles}
        onClose={onClose}
      />
    </EntityFormDrawer>
  );
}
