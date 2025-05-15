import { LabDataSimple, Vineyard } from "@/models/types/db";
import { generateLabData } from "@/utils/lab-data-generator";

export function getData(): Vineyard[] {
  return [
    {
      group: ["Group One", "Vineyard 1", "vineyardDetails"],
      name: "Vineyard 1",
      grapeVariety: "Cabernet Sauvignon",
      status: "Maintenance",
      forcastedYield: 0,
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
          eco: { active: true, fileUrl: "" },
          igp: { active: true, fileUrl: "" },
          dop: { active: true, fileUrl: "" },
        },
      },
      labData: generateLabData() as LabDataSimple[],
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
        },
        {
          amount: 1,
          id: "2",
          status: "in-progress",
        },
        {
          amount: 1,
          id: "3",
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
    },
    {
      group: ["Group One", "Vineyard 2", "vineyardDetails"],
      name: "Vineyard 2",
      grapeVariety: "Cabernet Sauvignon",
      status: "Maintenance",
      forcastedYield: 0,
      labData: generateLabData() as LabDataSimple[],
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
        },
        {
          amount: 1,
          id: "2",
          status: "in-progress",
        },
        {
          amount: 1,
          id: "3",
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
    },
    {
      group: ["Group Two", "Vineyard 5", "vineyardDetails"],
      name: "Vineyard 5",
      grapeVariety: "Cabernet Sauvignon",
      status: "Maintenance",
      forcastedYield: 0,
      labData: generateLabData() as LabDataSimple[],
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
        },
        {
          amount: 1,
          id: "2",
          status: "in-progress",
        },
        {
          amount: 1,
          id: "3",
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
    },
    {
      group: ["Group Two", "Group Three", "Vineyard 4", "vineyardDetails"],
      name: "Vineyard 4",
      grapeVariety: "Cabernet Sauvignon",
      status: "Maintenance",
      forcastedYield: 0,
      labData: generateLabData() as LabDataSimple[],
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
        },
        {
          amount: 1,
          id: "2",
          status: "in-progress",
        },
        {
          amount: 1,
          id: "3",
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
    },
    {
      group: ["Group Two", "Group Three", "Vineyard 7", "vineyardDetails"],
      name: "Vineyard 7",
      grapeVariety: "Cabernet Sauvignon",
      status: "Maintenance",
      forcastedYield: 0,
      labData: generateLabData() as LabDataSimple[],
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
        },
        {
          amount: 1,
          id: "2",
          status: "in-progress",
        },
        {
          amount: 1,
          id: "3",
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
    },
    {
      group: ["Vineyard 3", "vineyardDetails"],
      name: "Vineyard 2",
      grapeVariety: "Cabernet Sauvignon",
      status: "Maintenance",
      forcastedYield: 0,
      info: {
        location: {
          map: [],
          surface: 125,
          country: "",
          city: "",
          elevation: 0,
          orientation: "",
        },
        vines: {
          yearOfPlantation: 2010,
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
          eco: { active: true, fileUrl: "" },
          igp: { active: true, fileUrl: "" },
          dop: { active: true, fileUrl: "" },
        },
      },
      labData: generateLabData() as LabDataSimple[],
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
        },
        {
          amount: 1,
          id: "2",
          status: "in-progress",
        },
        {
          amount: 1,
          id: "3",
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
    },
  ];
}
