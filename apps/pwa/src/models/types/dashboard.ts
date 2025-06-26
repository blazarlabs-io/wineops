import {
  Chemistry,
  Consumable,
  Grape,
  GrapeStatus,
  Must,
  Priority,
  TeamMember,
  Vessel,
  Vineyard,
  VineyardStatus,
  Wine,
} from "./db";

export type DashboardEntity =
  | Vineyard
  | Grape
  | Must
  | TeamMember
  | Wine
  | Vessel
  | Chemistry
  | Consumable;

export type EntityStatus = VineyardStatus | GrapeStatus | Priority;

export type GroupBy =
  | "groupByDate"
  | "groupByVariety"
  | "groupByStatus"
  | "groupByVesselType"
  | "groupByLocation"
  | "type";
