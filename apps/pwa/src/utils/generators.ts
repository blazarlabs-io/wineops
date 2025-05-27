import {
  LabDataSimple,
  LabElement,
  Note,
  TaskStatus,
  TaskSummary,
} from "@/models/types/db";
import { getRandomDate } from "./date-utils";
import { SingleDocument } from "@/models/types/db";
import { taskStatuses } from "@/data/system-variables";
import { wineryNotes, wineryNotesTitles } from "@/data/notes-sample-data";

const start = new Date("2024-01-01");
const end = new Date("2025-01-01");

export const generateLabData = () => {
  const data: LabDataSimple[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i.toString(),
      fileUrl: "", // url generator
      items: generateItems(20),
      date: new Date().toISOString(),
    });
  }
  return data;
};

const generateItems = (total: number) => {
  const items: LabElement[] = [];
  for (let i = 0; i < total; i++) {
    items.push({
      id: i.toString(),
      name: i % 2 === 0 ? "Sugar" : "Acidity",
      value: Math.random() * 30,
      variation: Math.random() * 20 - 10, //random  value between -10 and 10
      unit: "g/dm3",
      responsible: {
        name: `Responsible ${i}`,
        email: `responsible${i}@email.com`,
      },
      date: getRandomDate(start, end).toISOString(),
    });
  }
  return items;
};

export const generateRandomFilenameWithWords = (
  extension: string = "",
  separator: string = "-",
  wordCount: number = 2
): string => {
  const words = [
    "cloud",
    "forest",
    "ocean",
    "river",
    "sunset",
    "mountain",
    "stone",
    "wind",
    "flame",
    "echo",
    "nova",
    "luna",
    "comet",
    "ember",
    "dust",
    "shadow",
    "glow",
    "drift",
    "mist",
  ];

  const parts = Array.from(
    { length: wordCount },
    () => words[Math.floor(Math.random() * words.length)]
  );

  const name = parts.join(separator);
  return extension ? `${name}.${extension.replace(/^\./, "")}` : name;
};

export const generateDummyDocs = (count: number) => {
  const items: SingleDocument[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: i.toString(),
      name: generateRandomFilenameWithWords("png", "_", 3),
      fileUrl: "",
      owner: {
        name: "John Doe",
        email: "2Tb3T@example.com",
      },
      uploadDate: getRandomDate(
        new Date("2024-01-01"),
        new Date("2025-01-01")
      ).toISOString(),
      media: {
        type: "application",
        subtype: "pdf",
        sizeMb: Math.random() * 10,
      },
    });
  }
  return items;
};

export const generateTasks = (): TaskSummary[] => {
  const tasks: TaskSummary[] = [];
  for (let i = 0; i < 10; i++) {
    tasks.push({
      id: new Date().toISOString(),
      amount: Math.floor(Math.random() * 20),
      status: getRandomTaskStatus(),
    });
  }
  return tasks;
};

const getRandomTaskStatus = (): TaskStatus => {
  const options = taskStatuses;
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};

const getRandomNote = (notes: string[]): string => {
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
};

export const generateNotes = (): Note[] => {
  const notes: Note[] = [];
  for (let i = 0; i < 10; i++) {
    notes.push({
      id: new Date().toISOString(),
      title: getRandomNote(wineryNotesTitles),
      content: getRandomNote(wineryNotes),
    });
  }
  return notes;
};

export function generateRandomId(length: number = 10): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
