import { TaskStatus } from "@/models/types/db";

export const orientations = [
  "north",
  "north-east",
  "north-west",
  "south",
  "south-east",
  "south-west",
  "east",
  "west",
];

export const soilTypes = [
  "Clay",
  "Silt",
  "Sand",
  "Loam",
  "Limestone",
  "Gravel",
  "Schist",
  "Slate",
  "Granite",
  "Volcanic",
  "Basalt",
  "Chalk",
  "Marl",
  "Alluvial",
  "Shale",
  "Pumice",
  "Tufa",
  "Sandstone",
  "Flint",
  "Quartz",
];

export const vineyardStatus = [
  "Maintenance",
  "Vegetation",
  "Ripening",
  "Ready for Harvest",
  "Harvesting",
  "Harvest Ended",
];

export const quickActions = [
  { name: "Harvest", icon: "hugeicons:grapes" },
  { name: "Weed removal", icon: "fluent:plant-grass-24-regular" },
  { name: "Fertilizer application", icon: "game-icons:fertilizer-bag" },
  { name: "Soil monitoring", icon: "game-icons:fertilizer-bag" },
  { name: "Pesticide application", icon: "healthicons:spraying-outline" },
  { name: "Pest inspection", icon: "material-symbols:pest-control-rounded" },
  { name: "Green harvesting", icon: "hugeicons:eco-energy" },
  { name: "Vine Prunning", icon: "ix:machine-c" },
  { name: "Watering", icon: "game-icons:plant-watering" },
  { name: "Laboratory results", icon: "material-symbols:lab-profile-outline" },
];

export const taskStatuses: TaskStatus[] = [
  "todo",
  "in-progress",
  "completed",
  "cancelled",
  "overdue",
];
