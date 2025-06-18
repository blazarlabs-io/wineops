import QuickTasksDrawer from "@/components/drawers/quick-tasks-drawer";
import QuickActionsIcon from "@/components/icons/quick-actions-icon";
import { useGrape } from "@/context/grape";
import { useVineyard } from "@/context/vineyard";
import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import {
  ActionsEntity,
  GrapeActions,
  VineyardActions,
} from "@/models/types/actions";
import { FormatListBulleted } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled, useColorScheme } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import QuickActionsDrawer from "../drawers/quick-actions-drawer";
import { useQuickDrawer } from "@/context/quick-drawer";
import { QuickDrawerType } from "@/models/types/db";

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
  const { open, type, updateOpen, updateType } = useQuickDrawer();
  const { actions: vineyardActions } = useVineyard();
  const { actions: grapeActions } = useGrape();
  const pn = usePathname();
  const router = useRouter();
  const [currentDashboard, setCurrentDashboard] = useState<string>("");

  const handleOpenChange = (type: string) => {
    updateOpen(false);
    updateType(type as QuickDrawerType);
  };

  useEffect(() => {
    if (pathname.startsWith("/workspace") || pathname === "/wine-production")
      return;

    router.push("/workspace" + pathname);
  }, [pathname]);

  useEffect(() => {
    if (pn) {
      const splitedPathname = pn.split(
        "/wine-production/"
      ) as unknown as ActionsEntity[];
      setCurrentDashboard(
        splitedPathname[splitedPathname.length - 1] as unknown as string
      );
    }
  }, [pn]);

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
        open={open}
        className=""
      >
        {children}
      </Main>

      {open && type === "tasks" && (
        <QuickTasksDrawer
          open={open && type === "tasks"}
          onOpenChange={() => handleOpenChange("tasks")}
        />
      )}
      {open && type === "actions" && (
        <>
          {currentDashboard === "vineyards" && (
            <QuickActionsDrawer<VineyardActions>
              open={open && type === "actions"}
              actions={vineyardActions}
              onOpenChange={() => handleOpenChange("actions")}
            />
          )}
          {currentDashboard === "grapes" && (
            <QuickActionsDrawer<GrapeActions>
              open={open && type === "actions"}
              actions={grapeActions}
              onOpenChange={() => handleOpenChange("actions")}
            />
          )}
        </>
      )}

      {!open && <div style={{ width: RIGHT_DRAWER_WIDTH }}></div>}

      {/* <Box
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
          sx={[open && type === "tasks" && { display: "none" }]}
          className=""
        >
          <FormatListBulleted />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          // edge="end"
          onClick={() => handleQuickActionsDrawerOpen(true)}
          sx={[open && type === "actions" && { display: "none" }]}
          style={{ backgroundColor: mode === "dark" ? "transparent" : "#333" }}
        >
          <QuickActionsIcon />
        </IconButton>
      </Box> */}
    </Box>
  );
}
