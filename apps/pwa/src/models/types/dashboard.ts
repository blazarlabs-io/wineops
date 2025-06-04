import { IFile } from "@/components/table/base-table/fileUtils";
import { Grape, GrapeStatus, Vessel, Vineyard, VineyardStatus } from "./db";

export type DashboardEntity = Vineyard | Grape | IFile | Vessel;

export type EntityStatus = VineyardStatus | GrapeStatus;
