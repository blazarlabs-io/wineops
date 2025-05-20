import { LabDataSimple, SingleDocument } from "./db";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Subject {
  id: string;
  name: string;
}

export interface VineyardHarvestAction {
  id: string;
  subject: Subject[];
  name: string;
  executionDate: Date;
  consumables: any;
  batchId: string;
  quantity: any;
  invoiceNumber: string;
  latestLabData: LabDataSimple;
  vessels: any;
  equipment: any;
  description: string;
  location: string;
  documents: SingleDocument[];
}
