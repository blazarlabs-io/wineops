import {
  VineyardGlobalAction,
  VineyardHarvestAction,
} from "@/models/types/actions";
import { Timestamp } from "firebase/firestore";

export const vineyardHarvestActionSample: VineyardHarvestAction = {
  id: "",
  type: "harvest",
  subject: {
    id: "",
    name: "",
  },
  executionDate: Timestamp.now(),
  consumables: [] as { id: string; name: string; qty: number }[],
  batchId: "",
  weight: "",
  invoiceNumber: "",
  equipment: [] as { id: string; name: string }[],
  description: "",
  location: "",
  responsible: {
    id: "",
    name: "",
    lastName: "",
    email: "",
  },
  sugar: {
    id: "",
    name: "",
    value: 0,
    variation: 0,
    unit: "g/dm³",
    responsible: {
      id: "",
      name: "",
      email: "",
    },
    date: Timestamp.now(),
  },
  acidity: {},
  certificateOfInofensiviate: "",
  transportCompanyName: "",
  transportVehicleId: "",
  transportDriverName: "",
};

export const vineyardGlobalActionSample: VineyardGlobalAction = {
  id: "",
  type: null,
  executionDate: Timestamp.now(),
  inUseVineyard: {
    id: "",
    name: "",
  },
  responsible: {
    id: "",
    name: "",
    email: "",
  },
  inputData: {},
  supportingDocuments: [],
  consumables: [],
  equipment: [],
};
