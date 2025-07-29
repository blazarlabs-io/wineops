import { useVineyard } from "@/context/vineyard";
import { useCallback, useState } from "react";

export const useVineyardNameExists = () => {
  const { vineyards } = useVineyard();

  const vineyardNames = vineyards?.map((vineyard) => vineyard.name);
  const nameSet = new Set(vineyardNames);

  const resolveName = useCallback(
    (baseName: string): string => {
      let _name = baseName;
      let counter = 1;

      while (nameSet.has(_name)) {
        _name = `${baseName}.${counter}`;
        counter++;
      }

      return _name;
    },
    [vineyardNames]
  );

  const checkIfNameExists = useCallback(
    (baseName: string): boolean => {
      return vineyardNames?.some((name) => name === baseName) as boolean;
    },
    [vineyardNames]
  );

  return {
    resolveName,
    checkIfNameExists,
  };
};
