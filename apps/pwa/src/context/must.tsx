"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { MUSTS, WINERY } from "@/lib/firebase/config";
import { Must, MustWineVessel, Vessel } from "@/models/types/db";
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
import { MustActions } from "@/models/types/actions";
import { mustDecantAction } from "@/lib/actions/must-actions";
import MustDecantActionForm from "@/components/forms/actions/must/must-decant-action-form";

interface MustContextType {
  musts: Must[];
  actions: MustActions;
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

  const [actions] = useState<MustActions>({
    "must-decant": {
      exec: mustDecantAction,
      form: <MustDecantActionForm />,
      icon: "material-symbols:science-outline",
    },
  });

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

  const hydrateMustsWithUpdatedVessels = useCallback(
    (musts: Must[], allVessels: Vessel[]): Must[] => {
      return musts.map((must) => {
        if (!must.vessels?.length) return must;

        const updatedVessels = must.vessels.map(({ id, qty }) => {
          const updated = {
            ...allVessels.find((vessel) => vessel.id === id),
            qty,
          };
          return updated;
        });

        return { ...must, vessels: updatedVessels as MustWineVessel[] };
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
        actions,
      }}
    >
      {children}
    </MustContext>
  );
};
