import { Certifications, SingleDocument, Vineyard } from "@/models/types/db";
import {
  generateDummyDocs,
  generateLabData,
  generateRandomId,
} from "@/utils/generators";

export function getData(): Vineyard[] {
  return [
    {
      id: generateRandomId(),
      group: ["Northern Lands"],
      // typse: "group",
      name: "Vineyard 1",
      cadastralNumber: "123",
      grapeVariety: "Grape 1",
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
        certifications: {} as Certifications,
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
      tasks: [],
      notes: [],
    },
  ];
}

/*
export function getData(): Vineyard[] {
  return [
    {
      id: "",
      group: ["Group One", "Vineyard 2"],
      name: "Vineyard 2",
      grapeVariety: "Cabernet Sauvignon",
      status: "Maintenance",
      forecastedYield: 0,
      labData: generateLabData(),
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
        },
        {
          id: "2",
          amount: 2,
          status: "in-progress",
        },
        {
          id: "3",
          amount: 10,
          status: "completed",
        },
      ],
      notes: [
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "1",
          title: "Welcome, new user!",
        },
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "2",
          title: "Welcome, new user!",
        },
      ],
      grapeColor: "Red",
      cadastralNumber: "CX-123456",
      info: {
        location: {
          map: [],
          surface: 0,
          country: "Argentina",
          city: "Buenos Aires",
          elevation: 10,
          orientation: "North",
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
      documents: [],
    },
    {
      id: "",
      group: [],
      name: "Vineyard 2",
      grapeVariety: "Cabernet Sauvignon",
      status: "Maintenance",
      forecastedYield: 0,
      labData: generateLabData(),
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
        },
        {
          id: "2",
          amount: 2,
          status: "in-progress",
        },
        {
          id: "3",
          amount: 10,
          status: "completed",
        },
      ],
      notes: [
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "1",
          title: "Welcome, new user!",
        },
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "2",
          title: "Welcome, new user!",
        },
      ],
      grapeColor: "Red",
      cadastralNumber: "CX-123456",
      info: {
        location: {
          map: [],
          surface: 0,
          country: "Argentina",
          city: "Buenos Aires",
          elevation: 10,
          orientation: "North",
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
      documents: [],
    },
  ];
}
*/
