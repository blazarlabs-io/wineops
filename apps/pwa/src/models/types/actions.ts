import { Timestamp } from "firebase/firestore";
import {
  Chemistry,
  EntityConsumable,
  Grape,
  LabElement,
  LabReport,
  LotStatus,
  Must,
  MustWineVessel,
  ResponsibleTeamMember,
  Supplier,
  TeamMember,
  Vineyard,
  Wine,
} from "./db";
import { DashboardEntity } from "./dashboard";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Subject<T extends DashboardEntity | Recipe = DashboardEntity> {
  id: T["id"];
  name: T["name"];
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
  "pest-inspection": VineyardSingleAction;
  "vine-pruning": VineyardSingleAction;
  "weed-removal": VineyardSingleAction;
  "soil-monitoring": VineyardSingleAction;
  "green-harvest": VineyardSingleAction;
  "fertilizer-application": VineyardSingleAction;
  "pesticide-application": VineyardSingleAction;
};

export type ActionIcons = {
  [key: string]: string;
};

export type GrapeSingleAction = {
  exec: (uid: string, actionData: any, grape: Grape) => void;
  form: any;
  icon: string;
  title?: string;
};

export type GrapeActions = {
  "grape-intake": GrapeSingleAction;
  "grape-process": GrapeSingleAction;
};

export type VineyardActionType = "harvest" | "lab-report" | "irrigation" | null;
export type GrapeActionType = "grape-intake" | "grape-process" | null;

export type GrapeIntakeAction = {
  id: string;
  type: GrapeActionType;
  subjectGrape?: Subject;
  executionDate: string | Timestamp;
  supplier: Partial<Supplier>;
  grapeVariety: string;
  weigherName?: TeamMember;
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
  certificatDeInofensivitate?: string;
  labTechnicianName?: string;
  processingLocation?: string;
  transportInfo?: {
    vehicleId?: string;
    companyName?: string;
    driverId?: string;
  };
  invoiceNumber?: string;
  supportingDocuments?: Array<{
    name: string;
    url: string;
  }>;
  additionalInfo?: string;
};

export type PressPercentage = {
  id: string;
  mustId: string;
  inputQuantity: number; //Litres
  vessels: Array<MustWineVessel>;
  newPressPercentage: number;
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
  pressPercentage?: Array<PressPercentage>;
  wasteQuantity?: number;
  metrics?: {
    actual?: number;
  };
  responsible?: TeamMember;
};

export interface VineyardHarvestAction {
  // * General Info
  id: string;
  type: VineyardActionType;
  subject: Subject;
  executionDate: string | Timestamp;
  batchId: string;
  weight: number | string;
  responsible?: TeamMember;
  consumables?: {
    id: string;
    name: string;
    qty: number;
  }[];
  equipment?: ActionRelation[];
  // * Transport Info
  location?: string;
  invoiceNumber?: string;
  transportCompanyName?: string;
  transportVehicleId?: string;
  transportDriverName?: string;
  // * QUALITY PARAMS
  sugar: Partial<LabElement>;
  acidity?: Partial<LabElement>;
  certificateOfInofensivitate?: string;
  // * ADDITIONAL INFO
  description?: string;
  harvestEnded?: boolean;
  supportingDocuments?: Array<{
    name: string;
    url: string;
  }>;
}

export interface VineyardGlobalAction {
  id: string;
  type: VineyardActionType;
  executionDate: string | Timestamp;
  inUseVineyard: ActionRelation;
  responsible?: ResponsibleTeamMember;
  inputData?: any;
  supportingDocuments?: { name: string; url: string }[];
  consumables?: {
    id: string;
    name: string;
    qty: number;
  }[];
  equipment?: ActionRelation[];
  labDataToDeleteIds?: string[];
  aditionalInformation?: string;
  chemistry?: ActionRelation[];
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
  date?: string | Timestamp;
};

export type ActionsEntity =
  | VineyardActions
  | GrapeActions
  | MustActions
  | WineActions;

export type SingleActionEntity =
  | VineyardSingleAction
  | GrapeSingleAction
  | WineSingleAction;

export type WineSingleAction = {
  exec: (uid: string, actionData: any, recipe: Recipe) => void;
  form: any;
  icon: string;
  title?: string;
};

export type WineActions = {
  "bottle-a-wine": WineSingleAction;
};

export type WineActionType = "bottle-a-wine" | null;

export type Recipe = Record<string, any>;

export type BottleSize = 0.375 | 0.75;

export const PackagingType = {
  SIX_PACK: "6-pack Box",
  TWELVE_PACK: "12-pack Box",
  MAGNUM_CASE: "Magnum Case",
} as const;

export type PackagingType = (typeof PackagingType)[keyof typeof PackagingType];

export type BottleWineAction = {
  id: string;
  type: WineActionType;
  collectionName: string;
  vintage: string;
  executionDate: string | Timestamp;
  subjectRecipe?: Subject<Recipe>;
  wines: Array<{
    id: Wine["id"];
    name: Wine["name"];
    qty: Wine["qty"];
    quantity: number;
    actions: ActionRelation[];
  }>;
  responsible?: TeamMember;
  //
  lotId: string;
  lotStatus?: LotStatus;
  //
  bottlingLine?: string;

  // Bottle specs
  bottleType: string; // Consumable["id"] with category Bottle
  bottleSize: BottleSize;
  closureType: string; // "Screw cap" | Consumable["id"] with category Cork
  capsuleType?: string; // Consumable["id"] with category Capsule
  labelType?: string; // Consumable["id"] with category Label
  bottleWeight?: number; // gramms

  // Packaging details
  packagingType?: PackagingType;
  bottlesPerBox?: number;
  packagingMaterial?: string;
  palletId?: string;

  // Final Lab Results
  alcohol: number;
  sugar: number;
  pH: number;
  totalSO2: number;
  freeSO2: number;
  turbidity?: number;
  labCertificateId?: string;

  // Quantity & Losses
  numberOfBottles: number;
  losses: number;

  supportingDocuments?: Array<{
    name: string;
    url: string;
  }>;
};
