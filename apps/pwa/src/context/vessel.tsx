"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { VESSELS, WINERY } from "@/lib/firebase/config";
import { Vessel } from "@/models/types/db";
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

interface VesselContextType {
  vessels: Vessel[];
  selectedVessels: Vessel[];
  updateSelectedVessels: (vessels: Vessel[]) => void;
}

const VesselContext = createContext<VesselContextType | null>(null);

export const useVessel = () => {
  const context = useContext(VesselContext);

  if (!context) {
    throw new Error(`'useVessel' was used outside of VesselProvider`);
  }

  return context;
};

interface IVesselProvider {
  children: ReactNode;
}

export const VesselProvider = ({ children }: IVesselProvider) => {
  const { user } = useAuth();

  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedVessels, setSelectedVessels] = useState<Vessel[]>([]);

  const updateSelectedVessels = useCallback((vessels: Vessel[]) => {
    setSelectedVessels(vessels);
  }, []);

  useEffect(() => {
    let unsubVessels = () => {};

    if (user && db) {
      const vesselsRef = collection(db, WINERY, user?.uid as string, VESSELS);

      unsubVessels = onSnapshot(vesselsRef, (querySnapshot) => {
        const vessels: Vessel[] = [];

        if (querySnapshot.empty) {
          console.log("No vessels found");
          setVessels([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          vessels.push({ ...data, id: data?.id ?? id } as Vessel);
        });

        setVessels(vessels);
      });
    }

    return () => {
      unsubVessels();
      setVessels([]);
    };
  }, [user]);

  const memoizedVessels = useMemo(() => vessels, [vessels]);
  const memoizedSelectedVessels = useMemo(
    () => selectedVessels,
    [selectedVessels]
  );

  return (
    <VesselContext
      value={{
        vessels: memoizedVessels,
        selectedVessels: memoizedSelectedVessels,
        updateSelectedVessels: updateSelectedVessels,
      }}
    >
      {children}
    </VesselContext>
  );
};
