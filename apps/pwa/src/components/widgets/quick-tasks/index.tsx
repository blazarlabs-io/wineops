import QuickTasksDrawer from "@/components/drawers/quick-tasks-drawer";
import QuickActionsIcon from "@/components/icons/quick-actions-icon";
import { FormatListBulleted } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useState } from "react";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
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

export default function PersistentDrawerRight({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "800px",
        height: "100%",
      }}
    >
      <Main sx={{ width: "100%" }} open={open}>
        {children}
      </Main>

      <QuickTasksDrawer open={open} onOpenChange={setOpen} />

      <Box
        sx={{ marginTop: "24px" }}
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
          onClick={handleDrawerOpen}
          sx={[open && { display: "none" }]}
          className=""
        >
          <FormatListBulleted />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          // edge="end"
          onClick={handleDrawerOpen}
          sx={[open && { display: "none" }]}
        >
          <QuickActionsIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
