/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from "firebase/firestore";

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

export type RowType = "group" | "item";

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
  labData: LabDataSimple[];
  tasks: TaskSummary[];
  notes: Note[];
  documents: SingleDocument[];
  group: string[];
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
};

export type Must = {
  id: string;
  name: string;
  group: string[];
  rowType?: RowType;
  grapes: string[];
  vineyards: string[];
  status: string;
  quantity: number;
  labData: LabDataSimple[];
  createdAt: string | Date;
  vessel: {
    id: string;
    name: string;
  };
  location: string;
  notes: Note[];
  tasks: TaskSummary[];
  grapeVariety: string;
};

export type FormMode = "create" | "edit";