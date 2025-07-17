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
  Handyman,
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
    ],
  },
  {
    segment: "storage",
    title: "Storage",
    icon: <Warehouse />,
  },
  {
    segment: "order-management",
    title: "Order Management",
    icon: <ManageSearch />,
  },
  {
    segment: "vessel",
    title: "Vessel Management",
    icon: <OilBarrel />,
  },
  {
    segment: "expendables",
    title: "Expendables",
    icon: <Inventory />,
    pattern: "workspace/expendables/",
    children: [
      {
        segment: "chemistry",
        title: "Chemistry",
        icon: <Science />,
      },
      {
        segment: "consumables",
        title: "Consumables",
        icon: <Output />,
      },
      {
        segment: "nomenclature",
        title: "Nomenclature",
        icon: <DriveFileRenameOutline />,
      },
    ],
  },
  {
    segment: "tools-equipment",
    title: "Tools & Equipment",
    icon: <Handyman />,
  },
  {
    segment: "team-management",
    title: "Team Management",
    icon: <ManageAccounts />,
    children: [
      {
        segment: "people",
        title: "People",
        icon: <Groups />,
      },
      {
        segment: "tasks",
        title: "Tasks",
        icon: <FormatListBulleted />,
      },
    ],
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <Assessment />,
  },
  {
    segment: "documents",
    title: "Documents",
    icon: <TextSnippet />,
  },
  {
    segment: "preferences",
    title: "Preferences",
    icon: <Settings />,
  },
];
