import { Timestamp } from "firebase/firestore";
import {
  Consumable,
  EntityConsumable,
  Grape,
  LabElement,
  LabReport,
  Must,
  MustWineVessel,
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

export type VineyardSingleAction = {
  exec: (uid: string, actionData: any, vineyard: Vineyard) => void;
  form: any;
  icon: string;
};

export type VineyardActions = {
  harvest: VineyardSingleAction;
  "lab-report": VineyardSingleAction;
  irrigation: VineyardSingleAction;
};

export type ActionIcons = {
  [key: string]: string;
};

export type GrapeSingleAction = {
  exec: (uid: string, actionData: any, grape: Grape) => void;
  form: any;
  icon: string;
};

export type GrapeActions = {
  "grape-intake": GrapeSingleAction;
  "grape-processing": GrapeSingleAction;
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

export type GrapeProcessingAction = {
  id: string;
  batchId: string;
  type: GrapeActionType;
  quantity?: number;
  executionDate: string | Timestamp;
  labReport?: LabReport;
  receivingBay?: any;
  destemmer?: any;
  press?: any;
  pressPercentage?: {
    mustId?: string;
    inputQuantity?: number; //Litres
    vessel?: string;
    newPressPercentage?: number;
  };
  wasteQuantity?: number;
  metrics?: {
    actual?: number;
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
  latestLabData: {
    date: Timestamp | string;
    sugar: Partial<LabElement>;
    acidity: Partial<LabElement>;
  };
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

export const MUST_ACTION_TYPES = ["must-decant"] as const;
export type MustActionType = (typeof MUST_ACTION_TYPES)[number];

export type MustActions = {
  [K in MustActionType]: {
    exec: (
      uid: string,
      actionData: MustDecantAction,
      must: Must,
      mustVessel?: MustWineVessel
    ) => void;
    form: any;
    icon: string;
  };
};

export type MustDecantAction = {
  id: string;
  type: MustActionType;
  subjectMust?: Subject;
  executionDate: string | Timestamp;

  mustId: string;
  vesselId: string;

  initialQty?: number;
  consumables?: EntityConsumable[];
  obtainedWineQty?: number; // metrics actual for Wine/Secondary Vinification
  vessels?: MustWineVessel[];
  wasteQuantity?: number;
  wasteUnit?: string;
  notes?: string;
  moveToWine?: boolean;
  wineName?: string;
  labReport?: LabReport;
};

export type ActionRelation = {
  id: string;
  name: string;
};

export type ActionsEntity = VineyardActions | GrapeActions | MustActions;

export type SingleActionEntity = VineyardSingleAction | GrapeSingleAction;
