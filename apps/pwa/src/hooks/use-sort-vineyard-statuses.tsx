/* eslint-disable @typescript-eslint/no-explicit-any */
import { VineyardStatus } from "@/models/types/db";
import { useEffect, useState } from "react";

export type SortedVineyardStatus = {
  name: string;
  count: number;
};

export const useSortVineyardStatuses = (statuses: VineyardStatus[]) => {
  const [vineyardStatuses, setVineyardStatuses] = useState<
    SortedVineyardStatus[]
  >([]);

  function countItems<T>(arr: T[]): { name: string; count: number }[] {
    const counts: Record<string, number> = {};

    arr.forEach((item: any) => {
      console.log(typeof item);
      let key: string;
      if (typeof item === "string") {
        key = String(item); // Convert to string for object keys
        counts[key] = (counts[key] || 0) + 1;
      } else {
        item.forEach((subitem: any) => {
          key = String(subitem); // Convert to string for object keys
          counts[key] = (counts[key] || 0) + 1;
        });
      }
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));
  }

  useEffect(() => {
    if (!statuses || statuses.length === 0 || statuses === undefined) return;
    const results = countItems(statuses);
    setVineyardStatuses(results);
  }, [statuses]);

  return { vineyardStatuses };
};
