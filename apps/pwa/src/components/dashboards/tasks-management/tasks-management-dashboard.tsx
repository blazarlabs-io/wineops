"use client";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import TasksTable from "@/components/table/tasks";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { useVineyard } from "@/context/vineyard";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { Task } from "@/models/types/db";
import { Box, Stack, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { StrictMode, useCallback, useState } from "react";

export default function TasksManagementDashboard() {
  const { user } = useAuth();
  const { tasks, selectedTasks, updateSelectedTasks } = useVineyard();

  // const [formType, setFormType] = useState<FormMode>("create");
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const handleSelectionChange = useCallback(
    (ts: Task[]) => {
      updateSelectedTasks(ts);
    },
    [updateSelectedTasks]
  );

  const handleCreateTask = useCallback(() => {
    // setFormType("create");
    // setOpenCreateEditTeamMember(true);
  }, []);

  const handleOpenDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(false);
  }, []);

  const handleDeleteTasks = useCallback(async () => {
    const res = await db.task.deleteMany(
      user?.uid as string,
      selectedTasks.map(({ id }) => id)
    );

    if (res.status === 200) {
      updateSelectedTasks([]);

      enqueueSnackbar(`Team member(s) deleted successfully`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Error deleting team member(s)`, {
        variant: "error",
      });
    }
    handleCloseDeleteDialog();
  }, [handleCloseDeleteDialog, selectedTasks, updateSelectedTasks, user?.uid]);

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
        <Typography variant="h4">Tasks Management</Typography>
        <div className="flex flex-col gap-6">
          <ToolsBar
            buttons={{
              [ButtonType.ADD]: {
                enabled: selectedTasks.length === 0,
                onClick: handleCreateTask,
              },
              [ButtonType.EDIT]: {
                enabled: selectedTasks.length === 1,
                onClick: () => {},
              },
              [ButtonType.DELETE]: {
                enabled: selectedTasks.length > 0,
                onClick: handleOpenDeleteDialog,
              },
            }}
          />
          <Box width={"100%"} height={"100%"}>
            <StrictMode>
              <TasksTable
                data={tasks as Task[]}
                onSelectionChange={handleSelectionChange}
              />
            </StrictMode>
          </Box>
        </div>
      </Stack>
      {/* {openCreateEditTeamMember && (
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
      )} */}

      <DeleteEntitiesDialog
        entityName="task"
        entities={selectedTasks}
        open={openDeleteDialog}
        onDelete={handleDeleteTasks}
        onClose={handleCloseDeleteDialog}
      />
    </Box>
  );
}
