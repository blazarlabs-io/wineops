import { Navigation } from "@toolpad/core/AppProvider";
import {
  Assessment,
  DriveFileRenameOutline,
  FormatListBulleted,
  Groups,
  Home,
  Inventory,
  Landscape,
  Liquor,
  LocalBar,
  ManageAccounts,
  ManageSearch,
  OilBarrel,
  Output,
  Science,
  Settings,
  TextSnippet,
  Warehouse,
  WineBar,
  Workspaces,
} from "@mui/icons-material";

export const NAVIGATION: Navigation = [
  {
    segment: "wine-production",
    title: "Wine Production",
    icon: <Home />,
    pattern: "workspace/wine-production/",
    children: [
      {
        segment: "vineyards",
        title: "Vineyards Management",
        icon: <Landscape />,
      },
      {
        segment: "grapes",
        title: "Grapes Management",
        icon: <Workspaces />,
      },
      {
        segment: "primary-vinification",
        title: "Primary Vinification",
        icon: <WineBar />,
      },
      {
        segment: "secondary-vinification",
        title: "Secondary Vinification",
        icon: <LocalBar />,
      },
      {
        segment: "bottling",
        title: "Wine Bottling",
        icon: <Liquor />,
      },
      {
        segment: "storage",
        title: "Storage",
        icon: <Warehouse />,
      },
      {
        segment: "vessel",
        title: "Vessel Management",
        icon: <OilBarrel />,
      },
    ],
  },
  {
    segment: "Order Management",
    title: "Order Management",
    icon: <ManageSearch />,
  },
  {
    segment: "expandables",
    title: "Expandables",
    icon: <Inventory />,
    pattern: "workspace/expandables/",
    children: [
      {
        segment: "Chemistry",
        title: "Chemistry",
        icon: <Science />,
      },
      {
        segment: "consumables",
        title: "Consumables",
        icon: <Output />,
      },
      {
        segment: "Nomenclature",
        title: "Nomenclature",
        icon: <DriveFileRenameOutline />,
      },
    ],
  },
  {
    segment: "Management",
    title: "Management",
    icon: <ManageAccounts />,
    children: [
      {
        segment: "Team",
        title: "Team",
        icon: <Groups />,
      },
      {
        segment: "Tasks",
        title: "Tasks",
        icon: <FormatListBulleted />,
      },
    ],
  },
  {
    segment: "Documents",
    title: "Documents",
    icon: <TextSnippet />,
  },
  {
    segment: "Reports",
    title: "Reports",
    icon: <Assessment />,
  },
  {
    segment: "Settings",
    title: "Settings",
    icon: <Settings />,
  },
];
