"use client";

import InnerDashboardLayout from "@/components/layout/inner-dashboard-layout";
import { NAVIGATION } from "@/components/navigation/sidebar-navigation";
import ToolBarActions from "@/components/navigation/tool-bar-actions";
import SidebarFooterAccount from "@/components/widgets/user-account";
import { useAuth } from "@/lib/firebase/auth";
import { mainTheme } from "@/lib/themes/main-theme";
import { Box } from "@mui/material";
import { AppProvider, Session } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";
import * as React from "react";
import { useEffect, useState } from "react";
import Logo from "../data-display/logo";
import { useSidebar } from "@/context/sidebar";

interface MainProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
  children?: React.ReactNode;
}

export default function WorkspaceLayout(props: MainProps) {
  const { window } = props;
  const { user } = useAuth();
  const { openSidebar } = useSidebar();
  const router = useDemoRouter("/wine-production");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = useState<Session | null>(null);

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

  useEffect(() => {
    console.log(openSidebar);
  }, [openSidebar]);

  return (
    // Remove this provider when copying and pasting into your project.
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
            <InnerDashboardLayout pathname={router.pathname}>
              {props.children}
            </InnerDashboardLayout>
          </Box>
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
