import TaskCard from "@/components/cards/task-card";
import CreateTaskForm from "@/components/forms/tasks/create-task-form";
import { useQuickDrawer } from "@/context/quick-drawer";
import { useWinery } from "@/context/winery";
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/services";
import { Task } from "@/models/types/db";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";

export default function QuickTasksWidget() {
  const { user } = useAuth();
  const { teamMembers } = useWinery();
  const { openForm } = useQuickDrawer();
  const [open, setOpen] = useState(openForm || false);

  const handleOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleCreateNewTask = useCallback(async (data: Task) => {
    setOpen(false);

    const taskRes = await db.task.create(user?.uid as string, data);

    if (taskRes.status === 200) {
      enqueueSnackbar("Task created successfully", { variant: "success" });
    } else {
      enqueueSnackbar("Error creating task", { variant: "error" });
    }

  }, []);

  return (
    <>
      <Box sx={{ width: RIGHT_DRAWER_WIDTH, overflowY: "hidden" }}>
        <Button
          variant="outlined"
          className="w-full"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Create Task
        </Button>
        {open && (
          <Box
            sx={{
              mt: 2,
              flexGrow: 1,
              width: RIGHT_DRAWER_WIDTH,
              height: "100%",
            }}
          >
            <CreateTaskForm
              teamMembers={teamMembers}
              uid={user?.uid as string}
              onDataSubmit={handleCreateNewTask}
              onClose={() => setOpen(false)}
            />
          </Box>
        )}
      </Box>
      {}
    </>
  );
}
