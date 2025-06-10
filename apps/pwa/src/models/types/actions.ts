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
  "grape-intake": {
    exec: (uid: string, actionData: any, grape: Grape) => void;
    form: any;
    icon: string;
  };
  "grape-processing": {
    exec: (uid: string, actionData: any, grape: Grape) => void;
    form: any;
    icon: string;
  };
};

export type VineyardActionType = "harvest" | "lab-report" | "irrigation" | null;
export type GrapeActionType = "grape-intake" | "grape-processing" | null;

export type GrapeIntakeAction = {
  id: string;
  type: GrapeActionType;
  subjectGrape?: Subject;
  executionDate: string | Timestamp;
  supplier?: string;
  grapeVariety?: string;
  weigherName?: ResponsibleTeamMember;
  mass?: {
    gross?: number;
    net?: number;
    tare?: number;
  };
  qualityCharacteristics?: {
    sugar?: number;
    acidity?: number;
    density?: number;
    temperature?: number;
    massFractionSpoiled?: number;
    massFractionCrushed?: number;
    massFractionMixed?: number;
  };
  labCertificateId?: string;
  certificateDeInofensiviate?: string;
  labTechnicianName?: string;
  transportInfo?: {
    vehicleId?: string;
    companyName?: string;
    driverId?: string;
  };
  invoiceNumber?: string;
  supportingDocument?: {
    name: string;
    url: string;
  };
};

export interface VineyardHarvestAction {
  id: string;
  type: VineyardActionType;
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
  type: VineyardActionType;
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
