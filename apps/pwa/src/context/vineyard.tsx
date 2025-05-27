"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { VINEYARDS, VINEYARDS_GROUPS, WINERY } from "@/lib/firebase/config";
import { Group, Vineyard } from "@/models/types/db";
import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
// import { useSortVineyardsGroups } from '@/hooks/use-sort-vineyards-groups';

interface VineyardContextType {
  vineyards: Vineyard[];
  selectedVineyards: Vineyard[];
  updateSelectedVineyards: (vineyards: Vineyard[]) => void;
  vineyardsGroups: Group[];
  // vineyardItemsGroups: VineyardItemGroup[];
}

const VineyardContext = createContext<VineyardContextType | null>(null);

// hook that we can use anywhere in the app
export const useVineyard = () => {
  const context = useContext(VineyardContext);

  if (!context) {
    throw new Error(`'useVineyard' was used outside of VineyardProvider`);
  }

  return context;
};

interface IAuthProvider {
  children: React.ReactNode;
}

export const VineyardProvider = ({ children }: IAuthProvider) => {
  const { user } = useAuth();

  const [vineyards, setVineyards] = useState<Vineyard[]>([]);
  const [selectedVineyards, setSelectedVineyards] = useState<Vineyard[]>([]);
  const [vineyardsGroups, setVineyardsGroups] = useState<Group[]>([]);
  // const [vineyardItemsGroups, setVineyardItemsGroups] = useState<VineyardItemGroup[]>([]);

  // const { vineyardsGroups: vig } = useSortVineyardsGroups(vineyards, vineyardsGroups);

  const updateSelectedVineyards = (vineyards: Vineyard[]) => {
    setSelectedVineyards(vineyards);
  };

  // useEffect(() => {
  //   setVineyardItemsGroups(vig);
  // }, [vig]);

  useEffect(() => {
    let unsubVineyards = () => {};

    let unsubVineyardsGroups = () => {};

    if (user && db) {
      // * Vineyards Realtime Updates
      const vineyardsRef = collection(
        db,
        WINERY,
        user?.uid as string,
        VINEYARDS
      );

      unsubVineyards = onSnapshot(vineyardsRef, (querySnapshot) => {
        const vineyards: Vineyard[] = [];

        if (querySnapshot.empty) {
          console.log("No vineyards found");
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          vineyards.push({ ...data, id: data?.id ?? id } as Vineyard);
        });

        console.log("\n====================================");
        console.log("REALTIME SnapShot vineyards:", vineyards);
        console.log("Selected Vineyards:", selectedVineyards);
        console.log("====================================\n");
        setVineyards(vineyards);
        // const updatedSelectedVineyards = vineyards.filter((vineyard) =>vineyard.id === selectedVineyards[0]?.id);

        // * Check if any of theselted vineyards exist in the vineyards array
        const updatedSelectedVineyards = selectedVineyards.filter((vineyard) =>
          vineyards.some((v) => v.id === vineyard.id)
        );

        console.log("updatedSelectedVineyards:", updatedSelectedVineyards);
      });

      // * Vineyards Groups Realtime Updates
      const vineyardsGroupsRef = collection(
        db,
        WINERY,
        user?.uid as string,
        VINEYARDS_GROUPS
      );

      unsubVineyardsGroups = onSnapshot(vineyardsGroupsRef, (querySnapshot) => {
        const vineyardsGroups: Group[] = [];

        if (querySnapshot.empty) {
          console.log("No vineyards groups found");
          return;
        }

        querySnapshot.forEach((doc) => {
          vineyardsGroups.push(doc.data() as Group);
        });
        setVineyardsGroups(vineyardsGroups);
      });
    }

    return () => {
      unsubVineyards();
      unsubVineyardsGroups();
      setVineyards([]);
      setVineyardsGroups([]);
    };
  }, [user, selectedVineyards]);

  return (
    <VineyardContext.Provider
      value={{
        vineyards,
        selectedVineyards,
        updateSelectedVineyards,
        vineyardsGroups,
        // vineyardItemsGroups,
      }}
    >
      {children}
    </VineyardContext.Provider>
  );
};
