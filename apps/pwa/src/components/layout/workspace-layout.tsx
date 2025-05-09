"use client";

import {
  Compress,
  Landscape,
  OilBarrel,
  Science,
  ShoppingBasket,
  Warehouse,
  Workspaces,
} from "@mui/icons-material";
import Home from "@mui/icons-material/Home";
import { Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import * as React from "react";
import ToolsBar from "../widgets/tools-bar";
import PersistentDrawerRight from "../widgets/quick-tasks";

const NAVIGATION: Navigation = [
  {
    segment: "home",
    title: "Home",
    icon: <Home />,
    children: [
      {
        segment: "Vineyards",
        title: "Vineyards",
        icon: <Landscape />,
      },
      {
        segment: "Grapes",
        title: "Grapes",
        icon: <Workspaces />,
      },
      {
        segment: "Must",
        title: "Must",
        icon: <Compress />,
      },
      {
        segment: "Bulk",
        title: "Bulk",
        icon: <OilBarrel />,
      },
      {
        segment: "Storage",
        title: "Storage",
        icon: <Warehouse />,
      },
    ],
  },
  {
    segment: "Vessel Management",
    title: "Vessel Management",
    icon: <OilBarrel />,
  },
  {
    segment: "Chemestry",
    title: "Chemestry",
    icon: <Science />,
  },
  {
    segment: "Consumables",
    title: "Consumables",
    icon: <ShoppingBasket />,
  },
];

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

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
  children?: React.ReactNode;
}

export default function WorkspaceLayout(props: DemoProps) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // Remove this provider when copying and pasting into your project.
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <p className="font-bold text-2xl">WineOps</p>,
        title: "",
        homeUrl: "/toolpad/core/introduction",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout defaultSidebarCollapsed>
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "hidden",
          }}
        >
          <PersistentDrawerRight>{props.children}</PersistentDrawerRight>
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
