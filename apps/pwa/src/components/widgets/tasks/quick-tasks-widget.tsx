import TaskCard from "@/components/cards/task-card";
import CreateTaskForm from "@/components/forms/tasks/create-task-form";
import { useWinery } from "@/context/winery";
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { useAuth } from "@/lib/firebase/auth";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useCallback, useState } from "react";

export default function QuickTasksWidget() {
  const { user } = useAuth();
  const { teamMembers } = useWinery();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <>
      <Box>
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
              onDataSubmit={() => setOpen(false)}
              onClose={() => setOpen(false)}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ width: RIGHT_DRAWER_WIDTH, overflowX: "hidden" }}>
        <TaskCard />
      </Box>
    </>
  );
}
