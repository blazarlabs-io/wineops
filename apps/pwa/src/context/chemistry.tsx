"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { CHEMISTRY, WINERY } from "@/lib/firebase/config";
import { Chemistry } from "@/models/types/db";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface ChemistryContextType {
  chemistry: Chemistry[];
}

const ChemistryContext = createContext<ChemistryContextType | null>(null);

export const useChemistry = () => {
  const context = useContext(ChemistryContext);

  if (!context) {
    throw new Error(`'useChemistry' was used outside of ChemistryProvider`);
  }

  return context;
};

interface IChemistryProvider {
  children: ReactNode;
}

export const ChemistryProvider = ({ children }: IChemistryProvider) => {
  const { user } = useAuth();

  const [chemistry, setChemistry] = useState<Chemistry[]>([]);

  useEffect(() => {
    let unsubChemistry = () => {};

    if (user && db) {
      const chemistryRef = collection(
        db,
        WINERY,
        user?.uid as string,
        CHEMISTRY
      );

      unsubChemistry = onSnapshot(chemistryRef, (querySnapshot) => {
        const chemistry: Chemistry[] = [];

        if (querySnapshot.empty) {
          console.log("No chemistry found");
          setChemistry([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          chemistry.push({ ...data, id: data?.id ?? id } as Chemistry);
        });
        setChemistry(chemistry);
      });
    }

    return () => {
      unsubChemistry();
      setChemistry([]);
    };
  }, [user]);

  const memoizedChemistry = useMemo(() => chemistry, [chemistry]);

  return (
    <ChemistryContext
      value={{
        chemistry: memoizedChemistry,
      }}
    >
      {children}
    </ChemistryContext>
  );
};
