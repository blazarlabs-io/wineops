/* eslint-disable @typescript-eslint/no-explicit-any */
export type TaskStatus = 'todo' | 'in-progress' | 'overdue' | 'cancelled' | 'completed';

export const VineyardStatus = {
  MAINTENANCE: 'Maintenance',
  VEGETATION: 'Vegetation',
  RIPPING: 'Ripening',
  READY_FOR_HARVEST: 'Ready for Harvest',
  HARVESTING: 'Harvesting',
  HARVEST_ENDED: 'Harvest Ended',
} as const;

export type VineyardStatus = (typeof VineyardStatus)[keyof typeof VineyardStatus];

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

export type LabElement = {
  id: string;
  name: string;
  value: number;
  variation: number;
  unit: string;
  responsible: ResponsibleTeamMember;
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

export type TaskSummary = {
  id: string;
  status: TaskStatus;
  amount: number;
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

export type Vineyard = {
  id: string;
  name: string;
  grapeVariety: string;
  grapeColor: string;
  cadastralNumber: string;
  info: VineyardInfo;
  grape: VineyardGrape;
  status: VineyardStatus;
  forecastedYield: number;
  labData: LabDataSimple;
  tasks: TaskSummary[];
  notes: Note[];
  documents: SingleDocument[];
  group: string;
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
