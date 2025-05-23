import { Certifications, Vineyard } from "@/models/types/db";
import {
  generateDummyDocs,
  generateLabData,
  generateNotes,
  generateRandomId,
  generateTasks,
} from "@/utils/generators";

export function getData(): Vineyard[] {
  return [
    {
      id: generateRandomId(),
      group: ["Northern Lands"],
      name: "Northern Lands",
      rowType: "group",
      cadastralNumber: "LP-123-456-789",
      grapeVariety: "Point Noir",
      grapeColor: "Red",
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
        } as Certifications,
      },
      labData: generateLabData(),
      documents: generateDummyDocs(10),
      grape: {
        id: "",
        clonalSelection: "",
        vivcNumber: "",
        countryOfOrigin: "",
      },
      status: "Maintenance",
      forecastedYield: 0,
      tasks: generateTasks(),
      notes: generateNotes(),
    },
    {
      id: generateRandomId(),
      group: ["Southern Lands", "Vineyard 4"],
      name: "Vineyard 4",
      rowType: "group",
      cadastralNumber: "LP-123-456-789",
      grapeVariety: "Point Noir",
      grapeColor: "Red",
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
        } as Certifications,
      },
      labData: generateLabData(),
      documents: generateDummyDocs(10),
      grape: {
        id: "",
        clonalSelection: "",
        vivcNumber: "",
        countryOfOrigin: "",
      },
      status: "Maintenance",
      forecastedYield: 0,
      tasks: generateTasks(),
      notes: generateNotes(),
    },
    {
      id: generateRandomId(),
      group: ["Northern Lands", "Vineyard 1"],
      rowType: "item",
      name: "Vineyard 1",
      cadastralNumber: "LP-123-456-789",
      grapeVariety: "Point Noir",
      grapeColor: "Red",
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
        } as Certifications,
      },
      labData: generateLabData(),
      documents: generateDummyDocs(10),
      grape: {
        id: "",
        clonalSelection: "",
        vivcNumber: "",
        countryOfOrigin: "",
      },
      status: "Maintenance",
      forecastedYield: 0,
      tasks: generateTasks(),
      notes: generateNotes(),
    },
    {
      id: generateRandomId(),
      group: ["Northern Lands", "Vineyard 2"],
      rowType: "item",
      name: "Vineyard 2",
      cadastralNumber: "MW-123-456-789",
      grapeVariety: "Merlot",
      grapeColor: "Red",
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
        } as Certifications,
      },
      labData: generateLabData(),
      documents: generateDummyDocs(10),
      grape: {
        id: "",
        clonalSelection: "",
        vivcNumber: "",
        countryOfOrigin: "",
      },
      status: "Maintenance",
      forecastedYield: 0,
      tasks: generateTasks(),
      notes: generateNotes(),
    },
    {
      id: generateRandomId(),
      group: ["Northern Lands", "Vineyard 3"],
      rowType: "item",
      name: "Vineyard 3",
      cadastralNumber: "XF-123-456-789",
      grapeVariety: "Cabernet Sauvignon",
      grapeColor: "Red",
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
        } as Certifications,
      },
      labData: generateLabData(),
      documents: generateDummyDocs(10),
      grape: {
        id: "",
        clonalSelection: "",
        vivcNumber: "",
        countryOfOrigin: "",
      },
      status: "Maintenance",
      forecastedYield: 0,
      tasks: generateTasks(),
      notes: generateNotes(),
    },
  ];
}
