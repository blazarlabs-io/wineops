import { IFile } from "@/components/table/base-table/fileUtils";
import {
  Grape,
  GrapeStatus,
  TeamMember,
  Vessel,
  Vineyard,
  VineyardStatus,
} from "./db";

export type DashboardEntity = Vineyard | Grape | IFile | Vessel | TeamMember;

export type EntityStatus = VineyardStatus | GrapeStatus;
