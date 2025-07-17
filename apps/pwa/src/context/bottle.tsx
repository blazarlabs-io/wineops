"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { BOTTLES, CONSUMABLES, WINERY } from "@/lib/firebase/config";
import { Bottle } from "@/models/types/db";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface BottleContextType {
  bottles: Bottle[];
}

const BottleContext = createContext<BottleContextType | null>(null);

export const useBottle = () => {
  const context = useContext(BottleContext);

  if (!context) {
    throw new Error(`'useBottle' was used outside of Bottle Provider`);
  }

  return context;
};

interface IBottleProvider {
  children: ReactNode;
}

export const BottleProvider = ({ children }: IBottleProvider) => {
  const { user } = useAuth();

  const [bottles, setBottles] = useState<Bottle[]>([]);

  useEffect(() => {
    let unsubBottles = () => {};

    if (user && db) {
      const bottlesRef = collection(db, WINERY, user?.uid as string, BOTTLES);

      unsubBottles = onSnapshot(bottlesRef, (querySnapshot) => {
        const _bottles: Bottle[] = [];

        if (querySnapshot.empty) {
          console.log("No bottles found");
          setBottles([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          _bottles.push({ ...data, id: data?.id ?? id } as Bottle);
        });

        setBottles(_bottles);
        console.log("Bottles", _bottles);
      });
    }

    return () => {
      unsubBottles();
      setBottles([]);
    };
  }, [user]);

  const memoizedBottles = useMemo(() => bottles, [bottles]);

  return (
    <BottleContext
      value={{
        bottles: memoizedBottles,
      }}
    >
      {children}
    </BottleContext>
  );
};
