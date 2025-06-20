/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from "firebase/firestore";
import { ActionRelation } from "./actions";

export const WineColor = {
  RED: "red",
  WHITE: "white",
} as const;

export type WineColor = (typeof WineColor)[keyof typeof WineColor];

export const QuickDrawerType = {
  ACTIONS: "actions",
  TASKS: "tasks",
} as const;

export type QuickDrawerType =
  (typeof QuickDrawerType)[keyof typeof QuickDrawerType];

export const TaskStatus = {
  NEW: "new",
  PENDING: "pending",
  "IN-PROGRESS": "in-progress",
  DONE: "done",
  OVERDUE: "overdue",
  BLOCKED: "blocked",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const VineyardStatus = {
  MAINTENANCE: "Maintenance",
  VEGETATION: "Vegetation",
  RIPPING: "Ripening",
  READY_FOR_HARVEST: "Ready for Harvest",
  HARVESTING: "Harvesting",
  HARVEST_ENDED: "Harvest Ended",
} as const;

export type VineyardStatus =
  (typeof VineyardStatus)[keyof typeof VineyardStatus];

export const Role = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export type MediaType = {
  type: string;
  subtype: string;
  sizeMb: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  date?: string | Timestamp;
  author?: TeamMember;
};

export const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export type Task = {
  id: string;
  title?: string;
  description?: string;
  assignedTo?: TeamMember;
  duration?: number;
  subjectOfAction?: {
    dashboard?: any;
    object?: any;
  };
  status?: TaskStatus;
  startDate?: string;
  dueDate?: string;
  notes?: Note[];
  priority?: Priority;
  createdBy?: TeamMember;
};

export type TaskSummary = {
  id: string;
  status: TaskStatus;
  amount: number;
};

export type LabElement = {
  id: string;
  name: string;
  value: number;
  variation: number;
  unit: string;
  responsible: ResponsibleTeamMember;
  date: string;
};

export type LabReport = {
  id: string;
  supportingDocs: string[];
  results: {
    [key: string]: {
      value: number;
      variation: number;
    };
  };
  units: string;
  responsible: ResponsibleTeamMember;
  date: Timestamp | string;
};

export type ResponsibleTeamMember = {
  name: string;
  email: string;
};

export const Department = {
  SALES: "sales",
  WINE_MAKING: "wine-making",
  STORAGE: "storage",
  LABORATORY: "laboratory",
} as const;

export type Department = (typeof Department)[keyof typeof Department];

export const CoreResponsibilities = {
  FERMENTATION_MONITORING: "Fermentation Monitoring",
  BOTTLING_AND_PACKAGING: "Bottling and Packaging",
  EQUIPMENT_MAINTENANCE: "Equipment Maintenance",
};

export type CoreResponsibility =
  (typeof CoreResponsibilities)[keyof typeof CoreResponsibilities];

export const Shift = {
  MONDAY: "Mo",
  TUESDAY: "Tu",
  WEDNESDAY: "We",
  THURSDAY: "Th",
  FRIDAY: "Fr",
  SATURDAY: "Sa",
  SUNDAY: "Su",
} as const;

export type Shift = (typeof Shift)[keyof typeof Shift];

export interface TeamMember extends ResponsibleTeamMember {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role?: Role | string;
  avatar?: string;
  department?: Department | string;
  contactPhone?: string;
}

export type EmergencyContact = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
};

export type LabDataSimple = {
  id: string;
  fileUrl: string;
  items: LabElement[];
  date: string;
};

export type LabDataChart = {
  id: string;
  items: LabReport[];
  date: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Location = {
  map: Coordinates[];
  surface: number | string;
  country: string;
  city: string;
  elevation: number | string;
  orientation: string;
};

export type Vines = {
  yearOfPlantation: number;
  plantingScheme: {
    spacing: number | string;
    rowOrientation: string;
    density: number | string;
    trellisSystem: string;
    plantsPerHa?: number | string;
  };
  soilType: string;
  sunlightHours: number | string;
};

export type Certifications = {
  eco: {
    active: boolean;
    fileUrl: string;
  };
  bio: {
    active: boolean;
    fileUrl: string;
  };
  igp: {
    active: boolean;
    fileUrl: string;
  };
  dop: {
    active: boolean;
    fileUrl: string;
  };
  ice: {
    active: boolean;
    fileUrl: string;
  };
};

export type VineyardGrape = {
  id: string;
  clonalSelection: string;
  vivcNumber: string;
  countryOfOrigin: string;
};

export type VineyardInfo = {
  location: Location;
  vines: Vines;
  certifications: Certifications;
};

export type SingleDocument = {
  id: string;
  name: string;
  fileUrl: string;
  owner: ResponsibleTeamMember;
  uploadDate: string;
  media: MediaType;
};

export const RowType = {
  GROUP: "group",
  ITEM: "item",
} as const;

export type RowType = (typeof RowType)[keyof typeof RowType];

type Entity = {
  id: string;
  name: string;
  group: string[];
  rowType?: RowType;
};

export type Vineyard = Entity & {
  grapeVariety: string;
  grapeColor: string;
  cadastralNumber: string[];
  info: VineyardInfo;
  grape: VineyardGrape;
  status: VineyardStatus;
  forecastedYield: number;
  tasks: TaskSummary[];
  notes: ActionRelation[];
  documents: SingleDocument[];
  createdAt?: string | Timestamp;
  // * RELATIONS * //
  vessels?: ActionRelation[];
  batches?: ActionRelation[];
  equipment?: ActionRelation[];
  actions?: ActionRelation[];
  labData?: ActionRelation[];
};

export type Winery = {
  id: string;
  name: string;
};

export type DbResponse = {
  status: number;
  data: any;
  error: any;
};

export interface Group extends Vineyard {
  grouping: {
    items: string[];
  };
}

export type VineyardItemGroup = {
  groupName: string | null;
  vineyards: Vineyard[];
};

export const GrapeStatus = {
  IN_TRANSIT: "In Transit",
  RECEIVED: "Received",
  PROCESSED: "Processed",
  DEHYDRATED: "Dehydrated",
  STORED: "Stored",
  FRIDGE_STORED: "Fridge Stored",
} as const;

export type GrapeStatus = (typeof GrapeStatus)[keyof typeof GrapeStatus];

export type GrapeEntry = {
  grossWeight: number;
  grossUnit?: string;
  netWeight: number;
  netUnit?: string;
  tareWeight: number;
  tareUnit?: string;
  weigherName: string;
  intakeDate: string | Timestamp;
};

export type Supplier = {
  companyName: string;
  dispatchInvoice: string;
  invoiceNo: string;
  vineyardName: string;
};

export type ProcessingInfo = {
  receivingBay: string;
  destemmer: string;
  pressUsed: string;
  vesselUsed: string;
};

export type TransportationInfo = {
  id: string;
  vehicleIdNo: string;
  companyName: string;
  driverIdNo: string;
  certificate: string;
  acquisitionInvoiceNo: string;
};

export type GrapeLabData = {
  id?: string;
  date: string | Timestamp;
  sugar: Partial<LabElement>;
  acidity: Partial<LabElement>;
  density: Partial<LabElement>;
  temperature: Partial<LabElement>;
  spoiledGrapesPercentage: number;
  crushedGrapesPercentage: number;
  addedGrapesVarietiesPercentage: number;
  labTechnicianName: string;
  labCertificateID: string;
};

export const Metric = {
  ACTUAL: "actual",
  SUPPLY: "supply",
  DEMAND: "demand",
} as const;

export type Metric = (typeof Metric)[keyof typeof Metric];

export type Metrics = Partial<Record<Metric, number>> & { unit?: string };

export type Grape = Entity & {
  entry: GrapeEntry;
  date: string | Timestamp;
  location: string;
  status: GrapeStatus;
  grapeVariety: string;
  certifications: Certifications;
  metrics: Metrics;
  supplier: Supplier;
  labData: GrapeLabData;
  notes: Note[];
  transportationInfo: TransportationInfo;
  processingInfo: ProcessingInfo;
  tasks: Task[];
  documents: SingleDocument[];
  musts?: ActionRelation[];
  actions?: ActionRelation[];
};

export type MustInfo = {
  id: string;
  date?: Must["date"];
  grapeVariety?: Must["grapeVariety"];
  qty?: number;
  name?: Must["name"];
  companyName?: Supplier["companyName"];
};

export type QtyInfo = {
  id: Must["id"];
  date?: Must["date"];
  process?: string;
  qty?: number;
  losses?: number;
};

export const MustStatus = {
  NEW_MUST: "New Must",
  PRESSED: "Pressed",
  FERMENTING: "Fermenting",
  DECANTED: "Decanted",
} as const;

export type MustStatus = (typeof MustStatus)[keyof typeof MustStatus];

export type MustLabData = {
  date: string | Timestamp;
  temperature: Partial<LabElement>;
  alcohol: Partial<LabElement>;
  sugar: Partial<LabElement>;
  acidity: Partial<LabElement>;
  volatileAcidity: Partial<LabElement>;
  yeastActivityPopulation: Partial<LabElement>;
  yeastAssimilableNitrogen: Partial<LabElement>;
  labTechnicianName: string;
  labCertificateID: string;
};

export type MustWineVessel = {
  id: Vessel["id"];
  name: Vessel["name"];
  qty: number;
  location: Vessel["location"];
  type: Vessel["type"];
};

export type EntityConsumable = Pick<Consumable, "id" | "name"> & {
  qty?: number;
};

export type Must = Entity & {
  date?: string | Timestamp;
  supplier?: Supplier;
  grapeVariety?: string;
  vessels?: MustWineVessel[];
  safetyCertificateNo?: string;
  invoicePurchaseNo?: string;
  labData?: MustLabData;
  status?: MustStatus;
  metrics?: Metrics;
  notes?: Note[];
  tasks?: Task[];
  documents?: SingleDocument[];
  actions?: ActionRelation[];
  consumables?: EntityConsumable[];
};

export type MustWithVessel = Must & {
  vesselId?: Vessel["id"];
  vesselType?: Vessel["type"];
  vesselName?: Vessel["name"];
  vesselLocation?: Vessel["location"];
};

export type FormMode = "create" | "edit";

export const ToastLevel = {
  LIGHT: "Light",
  MEDIUM: "Medium",
  MEDIUM_PLUS: "Medium-Plus",
  HIGH_HEAVY: "High(Heavy)",
  HYBRID_TOAST: "Hybrid Toast",
} as const;

export type ToastLevel = (typeof ToastLevel)[keyof typeof ToastLevel];

export const BarrelInfoUsage = {
  NEW_VESSEL: "New Vessel",
  "1st_USAGE": "1st Usage",
  "2nd_USAGE": "2nd Usage",
  MULTI_USAGE: "Multi-usage",
} as const;

export type BarrelInfoUsage =
  (typeof BarrelInfoUsage)[keyof typeof BarrelInfoUsage];

export type BarrelInfo = {
  usageStatus?: BarrelInfoUsage;
  manufacturer?: string;
  material?: string;
  toastLevel?: ToastLevel;
  stavesThickness?: number;
  oxygenTransmissionRate?: number;
  woodGrainDensity?: number;
};

export type StainlessSteelTankInfo = {
  usage?: string;
  materialGrade?: string;
  steelThickness?: number;
  coolingJacketsCoils?: boolean;
  insulationLayers?: boolean;
  pressureRating?: number;
};

export const VesselType = {
  BARREL: "Barrel",
  STAINLESS_STEEL_TANK: "Stainless Steel Tank",
  PUPITRE: "Pupitre",
  GYROPALETTE: "Gyropalette",
  OTHER: "Other",
} as const;

export type VesselType = (typeof VesselType)[keyof typeof VesselType];

export type VesselHistory = {
  id?: string;
  usage?: string; // Vessel.barrelInfo.usageStatus || Vessel.sstInfo.usage || usage
  batchID?: string; // Vessel.currentUsage
  dateIn?: string | Timestamp; // Vessel.startDate
  dateOut?: string | Timestamp; // next usage or Vessel.lastMaintenance
};

export type Vessel = Entity & {
  type: VesselType;
  lastMaintenance?: string | Timestamp;
  location?: string;
  currentUsage?: string;
  startDate?: string | Timestamp;
  volume?: string;
  volumeUnit?: string;
  usage?: string;
  barrelInfo?: BarrelInfo;
  sstInfo?: StainlessSteelTankInfo;
  history?: VesselHistory[];
};

export const ConsumableCategory = {
  LABEL: "Label",
  CORK: "Cork",
  BOTTLE: "Bottle",
  FILTER: "Filter",
} as const;

export type ConsumableCategory =
  (typeof ConsumableCategory)[keyof typeof ConsumableCategory];

export type ExpandableUsage = {
  id?: string;
  inUseToday?: number;
  inUseThisWeek?: number;
  location?: string;
  person?: string;
  process?: string;
  createdAt?: string | Timestamp;
};

export type Consumable = Entity & {
  category?: ConsumableCategory;
  consumableID?: string;
  qty?: number;
  minimumStockAlert?: number;
  manufacturer?: string;
  certificatCalitate?: string;
  orderDate?: string | Timestamp;
  invoiceNo?: string;
  specifications?: string;
  storageHandlingNotes?: string;
  expiryDate?: string | Timestamp;
  organicBiodynamicStatus?: boolean;
  compatibleEquipment?: string;
  usage?: ExpandableUsage[];
};

export const ChemistryType = {
  ANTIOXIDANTS: "Antioxidants",
  FINING_AGENTS: "Fining Agents",
  STABILIZERS: "Stabilizers",
  ACID_REGULATORS: "Acid Regulators",
  ENZYMES: "Enzymes",
  YEASTS: "Yeasts",
  FERMENTATION_NUTRIENTS: "Fermentation Nutrients",
};

export type ChemistryType = (typeof ChemistryType)[keyof typeof ChemistryType];

export const StageOfProduction = {
  VINEYARDS_MANAGEMENT: "Vineyards Management",
  GRAPES_MANAGEMENT: "Grapes Management",
  PRIMARY_VINIFICATION: "Primary Vinification",
  SECONDARY_VINIFICATION: "Secondary Vinification",
  WINE_BOTTLING: "Wine Bottling",
};

export type StageOfProduction =
  (typeof StageOfProduction)[keyof typeof StageOfProduction];

export type Chemistry = Entity & {
  orderDate?: string | Timestamp;
  chemistryID?: string;
  type?: ChemistryType;
  qty?: number;
  dosage?: string;
  usage?: ExpandableUsage[];
  stageOfProduction: StageOfProduction;
  recommendedDosage?: number;
  maxDosage?: number;
  expiryDate?: string | Timestamp;
  invoiceNo?: string;
  manufacturer?: string;
  certificatCalitate?: string;
  minimumStockAlert?: number;
  legalUseNotes?: string;
  comments?: string;
};

export type WineInfo = {
  id: string;
  date?: Must["date"];
  grapeVariety?: Must["grapeVariety"];
  qty?: number;
};

export const WineStatus = {
  NEW_WINE: "New Wine",
  BARICARE: "Baricare",
} as const;

export type WineStatus = (typeof WineStatus)[keyof typeof WineStatus];

export type WineLabData = {
  date: string | Timestamp;
  temperature: Partial<LabElement>;
  alcohol: Partial<LabElement>;
  sugar: Partial<LabElement>;
  acidity: Partial<LabElement>;
  totalSO2: Partial<LabElement>;
  freeSO2: Partial<LabElement>;
  volatileAcidity: Partial<LabElement>;
  labTechnicianName: string;
  labCertificateID: string;
};

export type GrapeVariety = {
  id: string;
  name: string;
  percentage: number;
};

export type Wine = Entity & {
  date?: string | Timestamp;
  supplier?: Supplier;
  grapeVariety?: string;
  qty?: number;
  vessels?: MustWineVessel[];
  grapeVarieties?: GrapeVariety[];
  safetyCertificateNo?: string;
  invoicePurchaseNo?: string;
  labData?: WineLabData;
  status?: WineStatus;
  metrics?: Metrics;
  notes?: Note[];
  tasks?: Task[];
  consumables?: EntityConsumable[];
};
