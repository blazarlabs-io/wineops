import { LabDataChart } from "@/models/types/db";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export type SortedLabData = {
  sugar: number[];
  acidity: number[];
  labels: string[];
};

export const useSortChartData = ({ items }: LabDataChart) => {
  const [labData, setLabData] = useState<SortedLabData | null>(null);

  useEffect(() => {
    if (items?.length) {
      const sugar: number[] = [];
      const acidity: number[] = [];
      const labels: string[] = [];
      [
        ...items.sort(
          (a, b) =>
            (a.date as Timestamp).toDate().getTime() -
            (b.date as Timestamp).toDate().getTime()
        ),
      ].forEach(({ date, results = {} }) => {
        if (results?.sugar?.value) sugar.push(results.sugar.value);

        if (results?.acidity?.value) acidity.push(results.acidity.value);

        labels.push(
          `${new Date((date as Timestamp).seconds * 1000).toDateString()}`
        );
      });

      setLabData({
        sugar,
        acidity,
        labels,
      });
    }
  }, [items]);

  return { labData };
};
