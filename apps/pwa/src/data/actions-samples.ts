import {
  VineyardGlobalAction,
  VineyardHarvestAction,
} from "@/models/types/actions";
import { LabDataSimple } from "@/models/types/db";
import { Timestamp } from "firebase/firestore";

export const vineyardHarvestActionSample: VineyardHarvestAction = {
  id: "",
  type: "harvest",
  subject: {
    id: "",
    name: "",
  },
  supplier: "",
  executionDate: Timestamp.now(),
  consumables: [],
  batch: {
    id: "",
    quantity: 0,
  },
  invoiceNumber: "",
  latestLabData: {} as LabDataSimple,
  vessels: [] as { id: string; name: string }[],
  equipment: [] as { id: string; name: string }[],
  description: "",
  location: "",
  documents: [],
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
    name: "",
    email: "",
  },
  inputData: {},
  notes: [],
  supportingDocuments: [],
};
