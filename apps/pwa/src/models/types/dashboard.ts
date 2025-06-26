import {
  Chemistry,
  Consumable,
  Grape,
  GrapeStatus,
  Priority,
  Vessel,
  Vineyard,
  VineyardStatus,
} from "./db";

export type DashboardEntity =
  | Vineyard
  | Grape
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
