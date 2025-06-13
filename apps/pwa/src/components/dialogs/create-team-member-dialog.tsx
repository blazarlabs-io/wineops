/* eslint-disable @typescript-eslint/no-explicit-any */
import { PersonAddAlt } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CreateTeamMemberForm from "../forms/team/create-team-member-form";
import { Role } from "@/models/types/db";
import { db } from "@/lib/firebase/services";
import { enqueueSnackbar } from "notistack";

export interface CreateTeamMemberDialogProps {
  open: boolean;
  uid: string;
  onClose: () => void;
}

export default function CreateTeamMemberDialog({
  open,
  uid,
  onClose,
}: CreateTeamMemberDialogProps) {
  const handleCreateNewTeamMember = async (data: any) => {
    const teamRes = await db.team.create(uid, data);

    if (teamRes.status === 200) {
      enqueueSnackbar("Team member created successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Error creating team member", { variant: "error" });
    }

    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="create-team-member-dialog-title"
      aria-describedby="create-team-member-dialog-description"
    >
      <DialogTitle
        id="create-team-member-dialog-title"
        className="flex items-center gap-1"
      >
        <PersonAddAlt color="primary" />
        Register Team Member
      </DialogTitle>

      <DialogContent className="min-w-[400px]">
        <DialogContentText id="create-team-member-dialog-description">
          Register a new team member.
        </DialogContentText>
        <CreateTeamMemberForm
          roles={Object.values(Role)}
          onDataSubmit={handleCreateNewTeamMember}
        />
      </DialogContent>

      {/* <DialogActions>
        <Button onClick={onClose} autoFocus>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {}}
          autoFocus
        >
          Register
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}
