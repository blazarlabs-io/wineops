import { Vineyard, VineyardStatus } from "@/models/types/db";
import { Timestamp } from "firebase/firestore";

const vineyardBlankSample: Vineyard = {
  id: Date.now().toString(),
  name: "",
  status: VineyardStatus.MAINTENANCE,
  grapeVariety: "",
  grapeColor: "",
  cadastralNumber: "",
  rowType: "item",
  info: {
    location: {
      map: [],
      surface: "",
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
        trellisSystem: false,
      },
      soilType: "",
      sunlightHours: 0,
    },
    certifications: {
      eco: {
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
  tasks: [],
  notes: [],
  documents: [],
  group: [],
};

export default vineyardBlankSample;
