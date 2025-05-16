import { LabDataSimple, LabElement } from "@/models/types/db";

export const generateLabData = () => {
  const data: LabDataSimple[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i.toString(),
      fileUrl: "", // url generator
      items: generateItems(Math.floor(Math.random() * 10)),
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
      variation: Math.random() * 10,
      unit: "g/dm3",
      responsible: {
        name: `Responsible ${i}`,
        email: `responsible${i}@email.com`,
      },
    });
  }
  return items;
};
