import { LabDataSimple, Vineyard, VineyardStatus } from "@/models/types/db";
import { generateDummyDocs, generateLabData } from "@/utils/generators";

const vineyardBlankSample: Vineyard = {
  id: Date.now().toString(),
  name: "",
  status: VineyardStatus.MAINTENANCE,
  grapeVariety: "",
  grapeColor: "",
  cadastralNumber: "",
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
    clonalSelection: "",
    vivcNumber: "",
    countryOfOrigin: "",
  },
  forecastedYield: 0,
  labData: generateLabData() as LabDataSimple[],
  tasks: [],
  notes: [
    {
      id: Date.now().toString(),
      title: "Welcome, new user!",
      content: "This is a test note. You can add, edit, and delete notes.",
    },
  ],
  documents: generateDummyDocs(10),
  group: [],
};

export default vineyardBlankSample;
