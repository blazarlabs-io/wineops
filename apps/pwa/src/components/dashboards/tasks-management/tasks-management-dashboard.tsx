"use client";
import DeleteEntitiesDialog from "@/components/dialogs/delete-entities-dialog";
import TasksTable from "@/components/table/tasks";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { Box, Stack, Typography } from "@mui/material";

export default function TasksManagementDashboard() {
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
        <ToolsBar
          buttons={{
            [ButtonType.GROUP]: { hide: true },
            [ButtonType.UNGROUP]: { hide: true },
            [ButtonType.PIVOT]: { hide: true },
            [ButtonType.PIN]: { hide: true },
          }}
        />

        <TasksTable />
      </Stack>

      <DeleteEntitiesDialog />
    </Box>
  );
}
