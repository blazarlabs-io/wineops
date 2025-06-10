import { Timestamp } from "firebase/firestore";
import {
  Grape,
  LabDataSimple,
  Note,
  ResponsibleTeamMember,
  SingleDocument,
  Vineyard,
} from "./db";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Subject {
  id: string;
  name: string;
}

// export type VineyardActions = {
//   harvest: (
//     uid: string,
//     actionData: VineyardHarvestAction,
//     vineyard: Vineyard
//   ) => void;
//   "lab-report": (uid: string, actionData: any, vineyard: Vineyard) => void;
// };

export type VineyardActions = {
  harvest: {
    exec: (
      uid: string,
      actionData: VineyardHarvestAction,
      vineyard: Vineyard
    ) => void;
    form: any;
    icon: string;
  };
  "lab-report": {
    exec: (uid: string, actionData: any, vineyard: Vineyard) => void;
    form: any;
    icon: string;
  };
  irrigation: {
    exec: (uid: string, actionData: any, vineyard: Vineyard) => void;
    form: any;
    icon: string;
  };
};

export type ActionIcons = {
  [key: string]: string;
};

export type GrapeActions = {
  harvest: (uid: string, actionData: any, grape: Grape) => void;
};

export type ActionType = "harvest" | "lab-report" | "irrigation" | null;

export interface VineyardHarvestAction {
  id: string;
  type: ActionType;
  subject: Subject;
  supplier: string;
  executionDate: string | Timestamp;
  consumables: any;
  batch: {
    id: string;
    quantity: number;
  };
  invoiceNumber: string;
  latestLabData: LabDataSimple;
  vessels: ActionRelation[];
  equipment: ActionRelation[];
  description: string;
  location: string;
  documents: SingleDocument[];
}

export interface VineyardGlobalAction {
  id: string;
  type: ActionType;
  executionDate: string | Timestamp;
  inUseVineyard: ActionRelation;
  responsible?: ResponsibleTeamMember;
  inputData?: any;
  notes?: Note[];
  supportingDocuments?: SingleDocument[];
  consumables?: ActionRelation[];
  equipment?: ActionRelation[];
}

export type ActionRelation = {
  id: string;
  name: string;
};

export type ActionsEntity = VineyardActions | GrapeActions;
