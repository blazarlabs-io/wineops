import {
  Bottle,
  Chemistry,
  Consumable,
  Grape,
  GrapeStatus,
  Must,
  MustWithVessel,
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
  | Consumable
  | Bottle
  | MustWithVessel;

export type EntityStatus = VineyardStatus | GrapeStatus | Priority;

export type GroupBy =
  | "groupByDate"
  | "groupByVariety"
  | "groupByStatus"
  | "groupByVesselType"
  | "groupByLocation"
  | "type"
  | "groupByMustName"
  | "groupByWineName";
