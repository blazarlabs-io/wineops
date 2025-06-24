"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { WINES, WINERY } from "@/lib/firebase/config";
import { MustWineVessel, Vessel, Wine } from "@/models/types/db";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useVessel } from "./vessel";

interface WineContextType {
  wines: Wine[];
}

const WineContext = createContext<WineContextType | null>(null);

export const useWine = () => {
  const context = useContext(WineContext);

  if (!context) {
    throw new Error(`'useWine' was used outside of WineProvider`);
  }

  return context;
};

interface IWineProvider {
  children: ReactNode;
}

export const WineProvider = ({ children }: IWineProvider) => {
  const { user } = useAuth();

  const [wines, setWines] = useState<Wine[]>([]);

  useEffect(() => {
    let unsubWines = () => {};

    if (user && db) {
      const winesRef = collection(db, WINERY, user?.uid as string, WINES);

      unsubWines = onSnapshot(winesRef, (querySnapshot) => {
        const wines: Wine[] = [];

        if (querySnapshot.empty) {
          console.log("No wines found");
          setWines([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          wines.push({ ...data, id: data?.id ?? id } as Wine);
        });

        setWines(wines);
      });
    }

    return () => {
      unsubWines();
      setWines([]);
    };
  }, [user]);

  const hydrateWinesWithUpdatedVessels = useCallback(
    (wines: Wine[], allVessels: Vessel[]): Wine[] => {
      return wines.map((wine) => {
        if (!wine.vessels?.length) return wine;

        const updatedVessels = wine.vessels.map(({ id, qty }) => {
          const updated = {
            ...allVessels.find((vessel) => vessel.id === id),
            qty,
          };
          return updated;
        });

        return { ...wine, vessels: updatedVessels as MustWineVessel[] };
      });
    },
    []
  );

  const { vessels } = useVessel();

  const hydratedWines = useMemo(
    () => hydrateWinesWithUpdatedVessels(wines, vessels),
    [hydrateWinesWithUpdatedVessels, wines, vessels]
  );

  return (
    <WineContext
      value={{
        wines: hydratedWines,
      }}
    >
      {children}
    </WineContext>
  );
};
