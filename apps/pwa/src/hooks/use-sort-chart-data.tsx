import { LabDataChart } from "@/models/types/db";
import formatDate from "@/utils/date-format";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

type SortedLabData = {
  sugar: number[];
  acidity: number[];
  alcohol?: number[];
  labels: string[];
};

export const useSortChartData = ({ items }: LabDataChart) => {
  const [labData, setLabData] = useState<SortedLabData | null>(null);

  useEffect(() => {
    if (items?.length) {
      const sugar: number[] = [];
      const acidity: number[] = [];
      const alcohol: number[] = [];
      const labels: string[] = [];
      [
        ...items.sort(
          (a, b) =>
            (a.date as Timestamp).toDate().getTime() -
            (b.date as Timestamp).toDate().getTime(),
        ),
      ].forEach(({ date, results = {} }) => {
        if (results?.sugar?.value) sugar.push(results.sugar.value);

        if (results?.acidity?.value) acidity.push(results.acidity.value);

        if (results?.alcohol?.value) alcohol.push(results.alcohol.value);

        labels.push(`${formatDate(date)}`);
      });

      setLabData({
        sugar,
        acidity,
        alcohol,
        labels,
      });
    }
  }, [items]);

  return { labData };
};
