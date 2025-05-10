"use client";

import QickTasksWrapper from "@/components/widgets/quick-tasks";
import { accounts } from "@/data/account-data-sample";
import { CheckCircle, Hub } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {
  Account,
  AccountPopoverFooter,
  AccountPreview,
  AccountPreviewProps,
  SignOutButton,
} from "@toolpad/core/Account";
import { AppProvider, Session } from "@toolpad/core/AppProvider";
import {
  DashboardLayout,
  SidebarFooterProps,
} from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import * as React from "react";
import { NAVIGATION } from "@/components/navigation/sidebar-navigation";
import SidebarFooterAccount from "../widgets/user-account";
import Logo from "../data-display/logo";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

/////////////////////////////////

////////////////////////////

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
  children?: React.ReactNode;
}

const demoSession = {
  user: {
    name: "Bharat Kashyap",
    email: "bharatkashyap@outlook.com",
    image: "https://avatars.githubusercontent.com/u/19550456",
  },
};

export default function WorkspaceLayout(props: DemoProps) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = React.useState<Session | null>(demoSession);

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(demoSession);
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);

  return (
    // Remove this provider when copying and pasting into your project.
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <Logo />,
        title: "",
        homeUrl: "/toolpad/core/introduction",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        defaultSidebarCollapsed
        slots={{
          toolbarAccount: () => null,
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
          }}
        >
          <QickTasksWrapper>{props.children}</QickTasksWrapper>
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
