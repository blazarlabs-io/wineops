"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { CONSUMABLES, WINERY } from "@/lib/firebase/config";
import { Consumable } from "@/models/types/db";
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

interface ConsumableContextType {
  consumables: Consumable[];
  selectedConsumables: Consumable[];
  updateSelectedConsumables: (consumables: Consumable[]) => void;
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
  const [selectedConsumables, setSelectedConsumables] = useState<Consumable[]>(
    []
  );

  const updateSelectedConsumables = useCallback((consumables: Consumable[]) => {
    setSelectedConsumables(consumables);
  }, []);

  useEffect(() => {
    let unsubConsumables = () => {};

    if (user && db) {
      const consumablesRef = collection(
        db,
        WINERY,
        user?.uid as string,
        CONSUMABLES
      );

      unsubConsumables = onSnapshot(consumablesRef, (querySnapshot) => {
        const consumables: Consumable[] = [];

        if (querySnapshot.empty) {
          console.log("No consumables found");
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
  const memoizedSelectedConsumables = useMemo(
    () => selectedConsumables,
    [selectedConsumables]
  );

  return (
    <ConsumableContext
      value={{
        consumables: memoizedConsumables,
        selectedConsumables: memoizedSelectedConsumables,
        updateSelectedConsumables: updateSelectedConsumables,
      }}
    >
      {children}
    </ConsumableContext>
  );
};
