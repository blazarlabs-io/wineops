import { Grape } from "@/models/types/db";
import { Timestamp } from "firebase/firestore";

export const grapeSample: Grape = {
  id: crypto.randomUUID(),
  rowType: "item",
  name: "Batch_XYZ",
  location: "location-1",
  group: ["Batch_XYZ"],
  entry: {
    grossWeight: 10,
    netWeight: 10,
    tareWeight: 10,
    weigherName: "Peter Pan",
    intakeDate: Timestamp.now(),
  },
  date: Timestamp.now(),
  grapeVariety: "Merlot",
  status: "New",
  certifications: {
    eco: {
      active: false,
      fileUrl: "",
    },
    bio: {
      active: false,
      fileUrl: "",
    },
    igp: {
      active: false,
      fileUrl: "",
    },
    dop: {
      active: false,
      fileUrl: "",
    },
    ice: {
      active: false,
      fileUrl: "",
    },
  },
  metrics: {
    unit: "kg",
  },
  supplier: {
    companyName: "Wine Shop",
    dispatchInvoice: "din-123",
    invoiceNo: "invoiceNo-123",
    vineyardName: "Vineyard 1",
  },
  labData: {
    id: "",
    date: Timestamp.now(),
    sugar: {
      value: 10,
      unit: "g/L",
    },
    acidity: {
      value: 10,
      unit: "g/L",
    },
    density: {
      value: 10,
      unit: "kg/L",
    },
    temperature: {
      value: 10,
      unit: "°C",
    },
    spoiledGrapesPercentage: 10,
    crushedGrapesPercentage: 10,
    addedGrapesVarietiesPercentage: 10,
    labTechnicianName: "John Doe",
    labCertificateID: "LAB-XYZ-123",
  },
  notes: [],
  transportationInfo: {
    id: "",
    vehicleIdNo: "vh-123",
    companyName: "FedEx",
    driverIdNo: "driver-123",
    certificate: "certificate-123",
    acquisitionInvoiceNo: "invoice-456",
    processingLocation: "location-789",
  },
  processingInfo: {
    receivingBay: "bay-123",
    destemmer: "destemmer-123",
    pressUsed: "press-123",
    vesselUsed: "vessel-123",
  },
  tasks: [],
  documents: [],
  musts: [],
  actions: [],
};
