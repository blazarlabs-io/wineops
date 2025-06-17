import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { Close, TaskAlt } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Drawer,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";

export type QuickTasksDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(8),
  padding: theme.spacing(0, 0),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  overflowX: "hidden",
}));

export default function QuickTasksDrawer({
  open,
  onOpenChange,
}: QuickTasksDrawerProps) {
  const handleDrawerClose = () => {
    onOpenChange(false);
  };

  const [openNewTask, setOpenNewTask] = useState<boolean>(false);

  const handleNewActionClick = () => {
    console.log("ACTION CLICKED");
    setOpenNewTask(true);
  };

  return (
    <Drawer
      sx={{
        width: RIGHT_DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          // width: RIGHT_DRAWER_WIDTH,
          overflowX: "hidden",
        },
        zIndex: (theme) => {
          let z = 0;
          if (open) {
            z = theme.zIndex.drawer;
          } else {
            z = theme.zIndex.drawer - 100;
          }
          return z;
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
      className=""
    >
      <DrawerHeader className="pointer-events-auto m-[0px] max-h-sfit p-[0px] pt-6 mt-[38px]">
        <IconButton onClick={handleDrawerClose} className="">
          <Close className="w-4 h-4" />
        </IconButton>
      </DrawerHeader>

      {/* * QUICK TASKS */}

      <Box px={2} display={"flex"} flexDirection={"column"} gap={2}>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <TaskAlt />
          <Typography variant="h5">Tasks</Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          sx={{ width: RIGHT_DRAWER_WIDTH, overflowX: "hidden" }}
          gap={2}
        >
          {/* * NEW TASK */}
          <Button
            variant="outlined"
            fullWidth
            type="button"
            className="cursor-pointer"
            onClick={handleNewActionClick}
          >
            New Task
          </Button>

          {/* * NEW TASK FORM */}
          {openNewTask && <></>}

          <Card
            sx={{
              minWidth: 0,
              maxWidth: RIGHT_DRAWER_WIDTH - 32,
              borderRadius: 3,
              position: "relative",
              paddingLeft: "12px",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                className="w-3 h-full"
                sx={{
                  backgroundColor: "primary.main",
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              />
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Box display={"flex"} flexDirection={"column"} gap={0}>
                    <Typography
                      gutterBottom
                      sx={{ color: "text.primary", fontSize: 14 }}
                    >
                      Task 1
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      className="truncate max-w-30"
                    >
                      Description goes here
                    </Typography>
                  </Box>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"flex-end"}
                    gap={0}
                    justifyContent={"center"}
                  >
                    <Typography
                      gutterBottom
                      sx={{ color: "text.primary", fontSize: 14 }}
                    >
                      Assignee
                    </Typography>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 24,
                          height: 24,
                        }}
                      >
                        <Typography variant="body2">A</Typography>
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                        className="truncate"
                      >
                        John Doe
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Box display={"flex"} flexDirection={"column"} gap={0}>
                    <Typography
                      gutterBottom
                      sx={{ color: "text.primary", fontSize: 14 }}
                    >
                      Start Date
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      className="truncate"
                    >
                      2025-01-01
                    </Typography>
                  </Box>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    gap={0}
                    alignItems={"flex-end"}
                  >
                    <Typography
                      gutterBottom
                      sx={{ color: "text.primary", fontSize: 14 }}
                    >
                      Due Date
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      className="truncate"
                    >
                      2025-01-01
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
            {/* <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions> */}
          </Card>
        </Box>
      </Box>
    </Drawer>
  );
}
