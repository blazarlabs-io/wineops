import { LabDataSimple, LabElement } from "@/models/types/db";
import { getRandomDate } from "./date-utils";
import { SingleDocument } from "@/models/types/db";

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
      value: Math.random() * 100,
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
