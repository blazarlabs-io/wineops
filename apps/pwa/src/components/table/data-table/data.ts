import { LabDataSimple, Vineyard } from "@/models/types/db";
import { generateLabData } from "@/utils/lab-data-generator";

export function getData(): Vineyard[] {
  return [
    {
      group: ["Group One", "Vineyard 1"],
      name: "Vineyard 1",
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
      group: ["Group One", "Vineyard 2"],
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
  ];
}
