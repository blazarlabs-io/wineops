import QuickTasksWidget from "@/components/widgets/tasks/quick-tasks-widget";
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { Close, TaskAlt } from "@mui/icons-material";
import { Box, Drawer, IconButton, styled, Typography } from "@mui/material";

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
        <QuickTasksWidget />
      </Box>
    </Drawer>
  );
}
