import { IFile } from "@/components/table/base-table/fileUtils";
import { Grape, GrapeStatus, Vineyard, VineyardStatus } from "./db";

export type DashboardEntity = Vineyard | Grape | IFile;

export type EntityStatus = VineyardStatus | GrapeStatus;
