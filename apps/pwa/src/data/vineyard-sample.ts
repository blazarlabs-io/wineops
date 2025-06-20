import { LabDataSimple, Vineyard, VineyardStatus } from "@/models/types/db";
import {
  generateDummyDocs,
  generateLabData,
  generateNotes,
  generateTasks,
} from "@/utils/generators";
import { Timestamp } from "firebase/firestore";

const vineyardSample: Vineyard = {
  id: Date.now().toString(),
  createdAt: Timestamp.now(),
  name: "",
  status: VineyardStatus.MAINTENANCE,
  grapeVariety: "",
  grapeColor: "",
  cadastralNumber: [],
  info: {
    location: {
      map: [],
      surface: 0,
      country: "",
      city: "",
      elevation: 0,
      orientation: "",
    },
    vines: {
      yearOfPlantation: 0,
      plantingScheme: {
        spacing: 0,
        rowOrientation: "",
        density: 0,
        trellisSystem: "",
      },
      soilType: "",
      sunlightHours: 0,
    },
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
  },
  grape: {
    id: "",
    clonalSelection: "",
    vivcNumber: "",
    countryOfOrigin: "",
  },
  forecastedYield: 0,
  labData: [],
  tasks: generateTasks(),
  notes: [],
  documents: generateDummyDocs(10),
  group: [],
};

export default vineyardSample;
