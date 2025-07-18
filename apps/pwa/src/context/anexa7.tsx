"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { ANEXA7, WINERY } from "@/lib/firebase/config";
import { Anexa7Data } from "@/models/types/reports";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface Anexa7ContextType {
  anexa7List: Anexa7Data[];
}

const Anexa7Context = createContext<Anexa7ContextType | null>(null);

export const useAnexa7List = () => {
  const context = useContext(Anexa7Context);

  if (!context) {
    throw new Error(`'useAnexa7List' was used outside of Anexa7Provider`);
  }

  return context;
};

interface IAnexa7Provider {
  children: ReactNode;
}

export const Anexa7Provider = ({ children }: IAnexa7Provider) => {
  const { user } = useAuth();

  const [anexa7List, setAnexa7List] = useState<Anexa7Data[]>([]);

  useEffect(() => {
    let unsubAnexa7List = () => {};

    if (user && db) {
      const Anexa7ListRef = collection(db, WINERY, user?.uid as string, ANEXA7);

      unsubAnexa7List = onSnapshot(Anexa7ListRef, (querySnapshot) => {
        const anexa7List: Anexa7Data[] = [];

        if (querySnapshot.empty) {
          console.log("No anexa 7 found");
          setAnexa7List([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          anexa7List.push({ ...data, id: data?.id ?? id } as Anexa7Data);
        });

        setAnexa7List(anexa7List);
      });
    }

    return () => {
      unsubAnexa7List();
      setAnexa7List([]);
    };
  }, [user]);

  const memoizedAnexa7List = useMemo(() => anexa7List, [anexa7List]);

  return (
    <Anexa7Context
      value={{
        anexa7List: memoizedAnexa7List,
      }}
    >
      {children}
    </Anexa7Context>
  );
};
