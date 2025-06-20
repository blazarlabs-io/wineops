import { Vineyard, VineyardStatus } from "@/models/types/db";
import { Timestamp } from "firebase/firestore";

const vineyardBlankSample: Vineyard = {
  id: Date.now().toString(),
  name: "",
  status: VineyardStatus.MAINTENANCE,
  grapeVariety: "",
  grapeColor: "",
  cadastralNumber: [],
  rowType: "item",
  info: {
    location: {
      map: [],
      surface: "",
      country: "",
      city: "",
      elevation: "",
      orientation: "",
    },
    vines: {
      yearOfPlantation: 0,
      plantingScheme: {
        spacing: "",
        rowOrientation: "",
        density: "",
        trellisSystem: "",
      },
      soilType: "",
      sunlightHours: "",
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
  tasks: [],
  notes: [],
  documents: [],
  group: [],
};

export default vineyardBlankSample;
