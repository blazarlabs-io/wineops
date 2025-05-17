import { LabDataSimple } from "@/models/types/db";
import { useEffect, useState } from "react";

export type SortedLabData = {
  sugar: number[];
  acidity: number[];
  labels: string[];
};

export const useSortChartData = (data: LabDataSimple) => {
  const [labData, setLabData] = useState<SortedLabData | null>(null);

  useEffect(() => {
    if (data) {
      const sugar: number[] = [];
      const acidity: number[] = [];
      const labels: string[] = [];
      data.items.forEach((item) => {
        if (item.name === "Sugar") {
          sugar.push(item.value);
        } else {
          acidity.push(item.value);
        }
        labels.push(`${new Date(item.date).toDateString()}`);
      });
      setLabData({ sugar, acidity, labels: labels.sort((a, b) => +a - +b) });
    }
  }, [data]);

  return { labData };
};
