/* eslint-disable @typescript-eslint/no-explicit-any */
import TasksTable from "@/components/table/grapes/tasks-table";
import { useQuickDrawer } from "@/context/quick-drawer";
import { useAuth } from "@/lib/firebase/auth";
import { Task, TaskStatus } from "@/models/types/db";
import {
  Add,
  AddCircleOutline,
  Autorenew,
  CheckCircle,
  PendingActions,
  Error,
  Block,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { useCallback, useEffect, useMemo, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const STATUSES_COLORS: Record<TaskStatus | "default", any> = {
  [TaskStatus.NEW]: { icon: AddCircleOutline, color: "#6495ED" },
  [TaskStatus.PENDING]: { icon: PendingActions, color: "#FFC107" },
  [TaskStatus["IN-PROGRESS"]]: { icon: Autorenew, color: "#00BCD4" },
  [TaskStatus.DONE]: { icon: CheckCircle, color: "#4CAF50" },
  [TaskStatus.OVERDUE]: { icon: Error, color: "#D32F2F" },
  [TaskStatus.BLOCKED]: { icon: Block, color: "#616161" },
  default: { icon: CalendarMonthIcon, color: "text.secondary" },
};
type TasksViewProps = {
  tasks: Task[];
};

export default function TasksView({ tasks }: TasksViewProps) {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [myTasksOnly, setMyTasksOnly] = useState(false);

  const handleChange = () => {
    setMyTasksOnly((prev) => !prev);
  };

  const handleStatusClick = (status: TaskStatus) => {
    setStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const myFilteredTasks = useMemo(
    () =>
      tasks.filter(
        ({ assignedTo }) =>
          !myTasksOnly || (myTasksOnly && user?.email === assignedTo?.email)
      ),
    [myTasksOnly, tasks, user?.email]
  );

  const filteredTasks = useMemo(
    () =>
      myFilteredTasks.filter(
        ({ status }) =>
          statuses.length === 0 || !status || statuses.includes(status)
      ),
    [myFilteredTasks, statuses]
  );

  const statusCounts: Map<TaskStatus, number> = useMemo(
    () =>
      myFilteredTasks.reduce(
        (acc, { status }) => acc.set(status, (acc.get(status) || 0) + 1),
        new Map()
      ),
    [myFilteredTasks]
  );

  useEffect(() => {
    setStatuses((prev) => prev.filter((s) => statusCounts.has(s)));
  }, [statusCounts]);

  const { updateOpen, updateType, updateOpenForm } = useQuickDrawer();

  const handleOpenChange = useCallback(() => {
    updateOpen(true);
    updateType("tasks");
    updateOpenForm(true);
  }, [updateOpen, updateOpenForm, updateType]);

  return (
    <Stack
      gap={1}
      direction="row"
      sx={{
        height: "100%",
      }}
    >
      <Stack
        justifyContent="flex-start"
        sx={{
          width: "260px",
        }}
      >
        <Stack
          gap={1}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            size="small"
            variant="text"
            className="capitalize!"
            startIcon={<Add />}
            onClick={handleOpenChange}
          >
            New Task
          </Button>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  name="myTasksOnly"
                  checked={myTasksOnly}
                  onChange={handleChange}
                  size="small"
                />
              }
              label="My Tasks"
              sx={{
                margin: 0,
                "& .MuiFormControlLabel-label": {
                  fontSize: "small",
                },
              }}
            />
          </FormGroup>

          <Button size="small" variant="text" className="capitalize!">
            View All
          </Button>
        </Stack>
        <Stack gap={1} alignItems="center" justifyContent="flex-start">
          <Typography variant="body2" sx={{ alignSelf: "start", pl: 1, pt: 2 }}>
            Filter by status:
          </Typography>

          <div className="grid grid-cols-2 w-full gap-3">
            {[...statusCounts].map(([status, count]) => {
              const Icon =
                STATUSES_COLORS[status]?.icon || STATUSES_COLORS.default.icon;
              const color =
                STATUSES_COLORS[status]?.color || STATUSES_COLORS.default.color;

              return (
                count > 0 && (
                  <Stack
                    key={status}
                    direction="row"
                    gap={0.5}
                    sx={{
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      size="small"
                      variant={statuses.includes(status) ? "outlined" : "text"}
                      className="lowercase!"
                      sx={{
                        borderRadius: 8,
                        width: "100%",
                        display: "flex",
                        px: 1,
                        py: 0.5,
                        color: statuses.includes(status) ? "#fff" : color,
                        border: 1,
                        borderColor: color,
                        background: statuses.includes(status)
                          ? color
                          : "transparent",
                      }}
                      onClick={() => handleStatusClick(status)}
                      startIcon={
                        <Icon
                          sx={{
                            fill: statuses.includes(status) ? "#fff" : color,
                          }}
                        />
                      }
                    >
                      <Box component="span" sx={{ flex: 1, textAlign: "left" }}>
                        {status}
                      </Box>
                    </Button>

                    <Typography
                      variant="caption"
                      component="div"
                      sx={({ palette }) => ({
                        display: "flex",
                        height: 24,
                        width: 24,
                        alignItems: "center",
                        justifyContent: "center",
                      })}
                    >
                      {count}
                    </Typography>
                  </Stack>
                )
              );
            })}
          </div>
        </Stack>
      </Stack>

      <Stack
        sx={{
          pl: 1,
          flex: 1,
          borderLeft: "1px solid var(--mui-palette-divider)",
        }}
      >
        <TasksTable data={filteredTasks} />
      </Stack>
    </Stack>
  );
}
