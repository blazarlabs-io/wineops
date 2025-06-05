"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { MUSTS, WINERY } from "@/lib/firebase/config";
import { Must, Vessel } from "@/models/types/db";
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

interface MustContextType {
  musts: Must[];
  selectedMusts: Must[];
  updateSelectedMusts: (musts: Must[]) => void;
}

const MustContext = createContext<MustContextType | null>(null);

export const useMust = () => {
  const context = useContext(MustContext);

  if (!context) {
    throw new Error(`'useMust' was used outside of MustProvider`);
  }

  return context;
};

interface IMustProvider {
  children: ReactNode;
}

export const MustProvider = ({ children }: IMustProvider) => {
  const { user } = useAuth();

  const [musts, setMusts] = useState<Must[]>([]);
  const [selectedMusts, setSelectedMusts] = useState<Must[]>([]);

  const updateSelectedMusts = useCallback((musts: Must[]) => {
    setSelectedMusts(musts);
  }, []);

  useEffect(() => {
    let unsubMusts = () => {};

    if (user && db) {
      const mustsRef = collection(db, WINERY, user?.uid as string, MUSTS);

      unsubMusts = onSnapshot(mustsRef, (querySnapshot) => {
        const musts: Must[] = [];

        if (querySnapshot.empty) {
          console.log("No musts found");
          setMusts([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          musts.push({ ...data, id: data?.id ?? id } as Must);
        });

        setMusts(musts);
      });
    }

    return () => {
      unsubMusts();
      setMusts([]);
    };
  }, [user]);

  const memoizedSelectedMusts = useMemo(() => selectedMusts, [selectedMusts]);

  const hydrateMustsWithUpdatedVessels = useCallback(
    (musts: Must[], allVessels: Vessel[]): Must[] => {
      return musts.map((must) => {
        if (!must.vessels?.length) return must;

        const updatedVessels = must.vessels.map((mustVessel) => {
          const updated = allVessels.find(({ id }) => id === mustVessel.id);
          return updated;
        });

        return { ...must, vessels: updatedVessels as Vessel[] };
      });
    },
    []
  );

  const { vessels } = useVessel();

  const hydratedMusts = useMemo(
    () => hydrateMustsWithUpdatedVessels(musts, vessels),
    [hydrateMustsWithUpdatedVessels, musts, vessels]
  );

  return (
    <MustContext
      value={{
        musts: hydratedMusts,
        selectedMusts: memoizedSelectedMusts,
        updateSelectedMusts,
      }}
    >
      {children}
    </MustContext>
  );
};
