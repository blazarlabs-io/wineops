"use client";

import { NAVIGATION } from "@/components/navigation/sidebar-navigation";
import ToolBarActions from "@/components/navigation/tool-bar-actions";
import SidebarFooterAccount from "@/components/widgets/user-account";
import { useQuickDrawer } from "@/context/quick-drawer";
import { useSidebar } from "@/context/sidebar";
import { useVineyard } from "@/context/vineyard";
import { useAuth } from "@/lib/firebase/auth";
import { mainTheme } from "@/lib/themes/main-theme";
import {
  ActionsEntity,
  GrapeActions,
  MustActions,
  VineyardActions,
  WineActions,
} from "@/models/types/actions";
import { QuickDrawerType } from "@/models/types/db";
import { Box } from "@mui/material";
import { AppProvider, Session } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";
import { ReactNode, useCallback, useEffect, useState } from "react";
import Logo from "../data-display/logo";
import QuickActionsDrawer from "../drawers/quick-actions-drawer";
import { usePathname, useRouter } from "next/navigation";
import { useGrape } from "@/context/grape";
import { useMust } from "@/context/must";
import QuickTasksDrawer from "../drawers/quick-tasks-drawer";
import { useWine } from "@/context/wine";
import { useDialogDrawerStore } from "@/store/dialogs";

interface MainProps {
  window?: () => Window;
  children?: ReactNode;
}

export default function WorkspaceLayout(props: MainProps) {
  const { window } = props;
  const { user } = useAuth();
  const { openSidebar } = useSidebar();
  const { open, type, updateOpen, updateType } = useQuickDrawer();
  const { actions: vineyardActions } = useVineyard();
  const { actions: grapeActions } = useGrape();
  const { actions: mustActions } = useMust();
  const { actions: wineActions } = useWine();

  const pathname = usePathname();
  const router = useDemoRouter("/workspace");
  const navRouter = useRouter();

  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = useState<Session | null>(null);
  const [currentDashboard, setCurrentDashboard] = useState<string>("vineyards");

  const handleOpenChange = useCallback(
    (type: string, value: any) => {
      updateOpen(value);
      updateType(type as QuickDrawerType);
    },
    [updateOpen, updateType],
  );

  useEffect(() => {
    if (router.pathname.startsWith("/workspace")) {
      const splitedPathname = pathname.split(
        "/workspace/wine-production/",
      ) as unknown as ActionsEntity[];
      setCurrentDashboard(splitedPathname[1] as unknown as string);
      return;
    }

    if (router.pathname) {
      const splitedPathname = router.pathname.split(
        "/wine-production/",
      ) as unknown as ActionsEntity[];

      const current = splitedPathname[
        splitedPathname.length - 1
      ] as unknown as string;

      setCurrentDashboard(current);
      navRouter.push(`/workspace/${router.pathname}`);
    }
  }, [navRouter, pathname, router.pathname]);

  useEffect(() => {
    if (user) {
      setSession({
        user: {
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        },
      });
    }
  }, [user]);

  const { dialogs, close } = useDialogDrawerStore((state) => state);

  const isActionsDrawerOpen =
    !!dialogs["action-drawer"] || (open && type === "actions");

  const handleDrawerClose = useCallback(() => {
    handleOpenChange("actions", false);
    if (!!dialogs["action-drawer"]) close("action-drawer");
  }, [close, dialogs, handleOpenChange]);

  useEffect(() => {
    if (
      !isActionsDrawerOpen ||
      [
        "vineyards",
        "grapes",
        "primary-vinification",
        "secondary-vinification",
      ].includes(currentDashboard)
    )
      return;

    handleDrawerClose();
  }, [currentDashboard, handleDrawerClose, isActionsDrawerOpen]);

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: <Logo />,
          title: "",
          homeUrl: "",
        }}
        router={router}
        theme={mainTheme}
        window={demoWindow}
        session={session}
      >
        <DashboardLayout
          hideNavigation={!openSidebar}
          disableCollapsibleSidebar
          defaultSidebarCollapsed={false}
          sidebarExpandedWidth={296}
          slots={{
            toolbarAccount: () => null,
            toolbarActions(props) {
              return <ToolBarActions {...props} />;
            },
            sidebarFooter: SidebarFooterAccount,
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflowY: "hidden",
              width: "100%",
            }}
          >
            {props.children}
          </Box>
        </DashboardLayout>
        {open && type === "tasks" && (
          <QuickTasksDrawer
            open={open && type === "tasks"}
            onOpenChange={() => handleOpenChange("tasks", false)}
          />
        )}
        {isActionsDrawerOpen && (
          <>
            {currentDashboard === "vineyards" && (
              <QuickActionsDrawer<VineyardActions>
                open={isActionsDrawerOpen}
                actions={vineyardActions}
                onOpenChange={handleDrawerClose}
                dashboard={currentDashboard}
              />
            )}
            {currentDashboard === "grapes" && (
              <QuickActionsDrawer<GrapeActions>
                open={isActionsDrawerOpen}
                actions={grapeActions}
                onOpenChange={() => handleOpenChange("actions", false)}
                dashboard={currentDashboard}
              />
            )}
            {currentDashboard === "primary-vinification" && (
              <QuickActionsDrawer<MustActions>
                open={isActionsDrawerOpen}
                actions={mustActions}
                onOpenChange={() => handleOpenChange("actions", false)}
                dashboard={currentDashboard}
              />
            )}
            {currentDashboard === "secondary-vinification" && (
              <QuickActionsDrawer<WineActions>
                open={isActionsDrawerOpen}
                actions={wineActions}
                onOpenChange={() => handleOpenChange("actions", false)}
                dashboard={currentDashboard}
              />
            )}
          </>
        )}
      </AppProvider>
    </DemoProvider>
  );
}
