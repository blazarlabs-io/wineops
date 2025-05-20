import { Grape, GrapeStatus, Vineyard, VineyardStatus } from "./db";

export type DashboardEntity = Vineyard | Grape;

export type EntityStatus = VineyardStatus | GrapeStatus;
