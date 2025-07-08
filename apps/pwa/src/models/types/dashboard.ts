import {
  Chemistry,
  Consumable,
  Grape,
  GrapeStatus,
  Must,
  Priority,
  Vessel,
  Vineyard,
  VineyardStatus,
  Wine,
} from "./db";

export type DashboardEntity =
  | Vineyard
  | Grape
  | Must
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
