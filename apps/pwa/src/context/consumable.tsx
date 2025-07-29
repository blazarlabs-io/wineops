"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { CONSUMABLES, WINERY } from "@/lib/firebase/config";
import { Consumable } from "@/models/types/db";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface ConsumableContextType {
  consumables: Consumable[];
}

const ConsumableContext = createContext<ConsumableContextType | null>(null);

export const useConsumable = () => {
  const context = useContext(ConsumableContext);

  if (!context) {
    throw new Error(`'useConsumable' was used outside of ConsumableProvider`);
  }

  return context;
};

interface IConsumableProvider {
  children: ReactNode;
}

export const ConsumableProvider = ({ children }: IConsumableProvider) => {
  const { user } = useAuth();

  const [consumables, setConsumables] = useState<Consumable[]>([]);

  useEffect(() => {
    let unsubConsumables = () => {};

    if (user && db) {
      const consumablesRef = collection(
        db,
        WINERY,
        user?.uid as string,
        CONSUMABLES,
      );

      unsubConsumables = onSnapshot(consumablesRef, (querySnapshot) => {
        const consumables: Consumable[] = [];

        if (querySnapshot.empty) {
          setConsumables([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          consumables.push({ ...data, id: data?.id ?? id } as Consumable);
        });

        setConsumables(consumables);
      });
    }

    return () => {
      unsubConsumables();
      setConsumables([]);
    };
  }, [user]);

  const memoizedConsumables = useMemo(() => consumables, [consumables]);

  return (
    <ConsumableContext
      value={{
        consumables: memoizedConsumables,
      }}
    >
      {children}
    </ConsumableContext>
  );
};
