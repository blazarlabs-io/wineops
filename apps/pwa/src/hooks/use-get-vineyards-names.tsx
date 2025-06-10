import { Vineyard } from "@/models/types/db";
import { useEffect, useState } from "react";

export const useGetVineyardsNames = (vineyards: Vineyard[]) => {
  const [vineyardNames, setVineyardNames] = useState<string[]>([]);

  useEffect(() => {
    console.log("vineyards", vineyards);
    if (!vineyards || vineyards.length === 0 || vineyards === undefined) return;
    const fVineyards = vineyards.filter(
      (vineyard) => vineyard.rowType === "item"
    );

    const names = fVineyards.map((vineyard) => vineyard.name);

    setVineyardNames(names);
  }, [vineyards]);

  return { vineyardNames };
};
