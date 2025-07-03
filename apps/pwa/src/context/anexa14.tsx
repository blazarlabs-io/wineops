"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { ANEXA14, WINERY } from "@/lib/firebase/config";
import { Anexa14Data } from "@/models/types/reports";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface Anexa14ContextType {
  anexa14List: Anexa14Data[];
}

const Anexa14Context = createContext<Anexa14ContextType | null>(null);

export const useAnexa14List = () => {
  const context = useContext(Anexa14Context);

  if (!context) {
    throw new Error(`'useAnexa14List' was used outside of Anexa14Provider`);
  }

  return context;
};

interface IAnexa14Provider {
  children: ReactNode;
}

export const Anexa14Provider = ({ children }: IAnexa14Provider) => {
  const { user } = useAuth();

  const [anexa14List, setAnexa14List] = useState<Anexa14Data[]>([]);

  useEffect(() => {
    let unsubAnexa14List = () => {};

    if (user && db) {
      const Anexa14ListRef = collection(
        db,
        WINERY,
        user?.uid as string,
        ANEXA14
      );

      unsubAnexa14List = onSnapshot(Anexa14ListRef, (querySnapshot) => {
        const anexa14List: Anexa14Data[] = [];

        if (querySnapshot.empty) {
          console.log("No anexa 14 found");
          setAnexa14List([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          anexa14List.push({ ...data, id: data?.id ?? id } as Anexa14Data);
        });

        setAnexa14List(anexa14List);
      });
    }

    return () => {
      unsubAnexa14List();
      setAnexa14List([]);
    };
  }, [user]);

  const memoizedAnexa14List = useMemo(() => anexa14List, [anexa14List]);

  return (
    <Anexa14Context
      value={{
        anexa14List: memoizedAnexa14List,
      }}
    >
      {children}
    </Anexa14Context>
  );
};
