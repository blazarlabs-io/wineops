import { VineyardHarvestAction } from "@/models/types/actions";
import { LabDataSimple } from "@/models/types/db";

export const vineyardHarvestActionSample: VineyardHarvestAction = {
  id: "",
  subject: [],
  name: "vineyard-harvest",
  executionDate: new Date(),
  consumables: [],
  batchId: "",
  quantity: {
    actual: 0,
    supply: 0,
    demand: 0,
    status: "",
  },
  invoiceNumber: "invoice",
  latestLabData: {} as LabDataSimple,
  vessels: [],
  equipment: [],
  description: "description",
  location: "location",
  documents: [],
};
