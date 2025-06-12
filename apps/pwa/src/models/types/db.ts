/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from "firebase/firestore";
import { ActionRelation } from "./actions";

export type TaskStatus =
  | "todo"
  | "in-progress"
  | "overdue"
  | "cancelled"
  | "completed";

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

export type MediaType = {
  type: string;
  subtype: string;
  sizeMb: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  assignee: string;
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
  surface: number;
  country: string;
  city: string;
  elevation: number;
  orientation: string;
};

export type Vines = {
  yearOfPlantation: number;
  plantingScheme: {
    spacing: number;
    rowOrientation: string;
    density: number;
    trellisSystem: boolean;
    plantsPerHa?: number;
  };
  soilType: string;
  sunlightHours: number;
};

export type Certifications = {
  eco: {
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

export type Vineyard = {
  id: string;
  name: string;
  rowType?: RowType;
  grapeVariety: string;
  grapeColor: string;
  cadastralNumber: string;
  info: VineyardInfo;
  grape: VineyardGrape;
  status: VineyardStatus;
  forecastedYield: number;
  tasks: TaskSummary[];
  notes: Note[];
  documents: SingleDocument[];
  group: string[];
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

export type Metrics = Partial<Record<Metric, number>>;

export type Grape = {
  id: string;
  name: string;
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
  group: string[];
  rowType?: RowType;
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

export type MustVessel = {
  id: Vessel["id"];
  name: Vessel["name"];
  qty: number;
  location: Vessel["location"];
  type: Vessel["type"];
};

export type Must = {
  id: string;
  name: string;
  group: string[];
  rowType?: RowType;
  date?: string | Timestamp;
  supplier?: Supplier;
  grapeVariety?: string;
  vessels?: MustVessel[];
  safetyCertificateNo?: string;
  invoicePurchaseNo?: string;
  labData: MustLabData;
  status?: MustStatus;
  metrics?: Metrics;
  notes?: Note[];
  tasks?: Task[];
  documents?: SingleDocument[];
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
  "1st_USAGE": "1st Usage",
  "2nd_USAGE": "2nd Usage",
  MULTI_USAGE: "Multi-usage",
} as const;

export type BarrelInfoUsage =
  (typeof BarrelInfoUsage)[keyof typeof BarrelInfoUsage];

export type BarrelInfo = {
  usage?: BarrelInfoUsage;
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
  usage?: string; // Vessel.barrelInfo.usage || Vessel.sstInfo.usage || usage
  batchID?: string; // Vessel.currentUsage
  dateIn?: string | Timestamp; // Vessel.startDate
  dateOut?: string | Timestamp; // next usage or Vessel.lastMaintenance
};

export type Vessel = {
  id: string;
  name: string;
  group: string[];
  rowType?: RowType;
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

export type ConsumableUsage = {
  id?: string;
  inUseToday?: number;
  inUseThisWeek?: number;
  location?: string;
  person?: string;
  process?: string;
  createdAt?: string | Timestamp;
};

export type Consumable = {
  id: string;
  name: string;
  group: string[];
  rowType?: RowType;
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
  usage?: ConsumableUsage[];
};
