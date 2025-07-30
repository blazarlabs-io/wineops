import { Grape } from "@/models/types/db";
import { useEffect, useState } from "react";

export const useGetGrapesNames = (grapes: Grape[]) => {
  const [grapesNames, setGrapesNames] = useState<string[]>([]);

  useEffect(() => {
    if (!grapes || grapes.length === 0 || grapes === undefined) return;
    const fVineyards = grapes.filter((grape) => grape.rowType === "item");

    const names = fVineyards.map((vineyard) => vineyard.name);

    setGrapesNames(names);
  }, [grapes]);

  return { grapesNames };
};
