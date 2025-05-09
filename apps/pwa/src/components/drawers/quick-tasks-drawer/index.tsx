import { Drawer, IconButton, Box, styled, useTheme } from "@mui/material";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export type QuickTasksDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function QuickTasksDrawer({
  open,
  onOpenChange,
}: QuickTasksDrawerProps) {
  const drawerWidth = 240;

  const theme = useTheme();

  const handleDrawerClose = () => {
    onOpenChange(false);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
        zIndex: (theme) => {
          let z = 0;
          if (open) {
            z = theme.zIndex.drawer + 1;
          } else {
            z = theme.zIndex.drawer - 100;
          }
          return z;
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
      className="pointer-events-none"
    >
      <DrawerHeader className="pointer-events-auto">
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      {/* QUICK TASKS */}
      <Box sx={{ width: 240 }}></Box>
    </Drawer>
  );
}
