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
    segment: "Wine Production",
    title: "Wine Production",
    icon: <Home />,
    children: [
      {
        segment: "Vineyards Management",
        title: "Vineyards Management",
        icon: <Landscape />,
      },
      {
        segment: "Grapes Management",
        title: "Grapes Management",
        icon: <Workspaces />,
      },
      {
        segment: "Primary Vinification",
        title: "Primary Vinification",
        icon: <WineBar />,
      },
      {
        segment: "Secondary Vinification",
        title: "Secondary Vinification",
        icon: <LocalBar />,
      },
      {
        segment: "Wine Bottling",
        title: "Wine Bottling",
        icon: <Liquor />,
      },
      {
        segment: "Storage",
        title: "Storage",
        icon: <Warehouse />,
      },
      {
        segment: "Vessel Management",
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
    segment: "Inventory",
    title: "Consumables",
    icon: <Inventory />,
    children: [
      {
        segment: "Chemistry",
        title: "Chemistry",
        icon: <Science />,
      },
      {
        segment: "Consumables",
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
    title: "Settingss",
    icon: <Settings />,
  },
];
