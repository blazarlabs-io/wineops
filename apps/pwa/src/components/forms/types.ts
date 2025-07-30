import { Subject } from "@/models/types/actions";
import { EntityConsumable, LabReport, MustWineVessel } from "@/models/types/db";
import { Timestamp } from "firebase/firestore";

export type FormValue =
  | string
  | number
  | boolean
  | Timestamp
  | {
      id: string;
      name: string;
      qty?: number;
    }[]
  | Subject
  | EntityConsumable[]
  | MustWineVessel[]
  | LabReport
  | undefined;
