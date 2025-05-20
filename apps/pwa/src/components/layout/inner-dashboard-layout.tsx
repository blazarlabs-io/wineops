import QuickTasksDrawer from "@/components/drawers/quick-tasks-drawer";
import QuickActionsIcon from "@/components/icons/quick-actions-icon";
import { FormatListBulleted } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled, useColorScheme } from "@mui/material/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import QuickActionsDrawer from "../drawers/quick-actions-drawer";
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { useRouter } from "next/navigation";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -RIGHT_DRAWER_WIDTH,
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
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const { mode } = useColorScheme();
  const router = useRouter();
  const [openQuickTasks, setOpenQuickTasks] = useState<boolean>(false);
  const [openQuickActions, setOpenQuickActions] = useState<boolean>(false);

  const handleQuickTasksDrawerOpen = (state: boolean) => {
    setOpenQuickTasks(state);
    setOpenQuickActions(false);
  };

  const handleQuickActionsDrawerOpen = (state: boolean) => {
    setOpenQuickActions(state);
    setOpenQuickTasks(false);
  };

  useEffect(() => {
    if (pathname.startsWith("/workspace") || pathname === "/wine-production")
      return;
    router.push("/workspace" + pathname);
  }, [pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        gap: 1,
      }}
      className=""
    >
      <Main
        sx={{ width: "100%", paddingLeft: "16px", paddingTop: "16px" }}
        open={openQuickTasks || openQuickActions}
        className=""
      >
        {children}
      </Main>

      {openQuickTasks && (
        <QuickTasksDrawer
          open={openQuickTasks}
          onOpenChange={handleQuickTasksDrawerOpen}
        />
      )}
      {openQuickActions && (
        <QuickActionsDrawer
          open={openQuickActions}
          onOpenChange={handleQuickActionsDrawerOpen}
        />
      )}

      {!openQuickTasks && !openQuickActions && (
        <div style={{ width: RIGHT_DRAWER_WIDTH }}></div>
      )}

      <Box
        sx={{ paddingTop: "74px" }}
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
          onClick={() => handleQuickTasksDrawerOpen(true)}
          sx={[openQuickTasks && { display: "none" }]}
          className=""
        >
          <FormatListBulleted />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          // edge="end"
          onClick={() => handleQuickActionsDrawerOpen(true)}
          sx={[openQuickActions && { display: "none" }]}
          style={{ backgroundColor: mode === "dark" ? "transparent" : "#333" }}
        >
          <QuickActionsIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
