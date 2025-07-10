import { LabDataChart, LabDataSimple } from "@/models/types/db";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export type SortedLabData = {
  sugar: number[];
  acidity: number[];
  labels: string[];
};

export const useSortChartData = (data: LabDataChart) => {
  const [labData, setLabData] = useState<SortedLabData | null>(null);

  useEffect(() => {
    if (data) {
      const sugar: number[] = [];
      const acidity: number[] = [];
      const labels: string[] = [];
      data.items.forEach(({ date, results = {} }) => {
        if (results?.sugar?.value) sugar.push(results.sugar.value);

        if (results?.acidity?.value) acidity.push(results.acidity.value);

        labels.push(
          `${new Date((date as Timestamp).seconds * 1000).toDateString()}`
        );
      });

      setLabData({
        sugar,
        acidity,
        labels: labels.sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        ),
      });
    }
  }, [data]);

  return { labData };
};
