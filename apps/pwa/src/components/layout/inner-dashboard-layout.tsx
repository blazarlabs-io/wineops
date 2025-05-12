import QuickTasksDrawer from "@/components/drawers/quick-tasks-drawer";
import QuickActionsIcon from "@/components/icons/quick-actions-icon";
import { FormatListBulleted } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled, useColorScheme } from "@mui/material/styles";
import * as React from "react";
import { useState } from "react";

const drawerWidth = 320;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  /**
   * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
   * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
   * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
   * proper interaction with the underlying content.
   */
  position: "relative",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
      },
    },
  ],
}));

export default function QickTasksWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode } = useColorScheme();
  const [open, setOpen] = useState<boolean>(false);

  const handleDrawerOpen = (state: boolean) => {
    setOpen(state);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        // minHeight: "800px",
        height: "100%",
        gap: 1,
      }}
      className=""
    >
      <Main
        sx={{ width: "100%", paddingLeft: "16px", paddingTop: "16px" }}
        open={open}
        className=""
      >
        {children}
      </Main>

      <QuickTasksDrawer open={open} onOpenChange={handleDrawerOpen} />

      <Box
        sx={{ paddingTop: "16px" }}
        flexDirection={"column"}
        display={"flex"}
        alignItems={"center"}
        minWidth={"fit-content"}
        rowGap={"16px"}
        className="pointer-events-auto"
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          // edge="end"
          onClick={() => handleDrawerOpen(true)}
          sx={[open && { display: "none" }]}
          className=""
        >
          <FormatListBulleted />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          // edge="end"
          onClick={() => handleDrawerOpen(true)}
          sx={[open && { display: "none" }]}
          style={{ backgroundColor: mode === "dark" ? "transparent" : "#333" }}
        >
          <QuickActionsIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
