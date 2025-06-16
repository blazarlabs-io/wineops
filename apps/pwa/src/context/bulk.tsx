"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { BULKS, WINERY } from "@/lib/firebase/config";
import { Bulk } from "@/models/types/db";
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

interface BulkContextType {
  bulks: Bulk[];
  selectedBulks: Bulk[];
  updateSelectedBulks: (bulks: Bulk[]) => void;
}

const BulkContext = createContext<BulkContextType | null>(null);

export const useBulk = () => {
  const context = useContext(BulkContext);

  if (!context) {
    throw new Error(`'useBulk' was used outside of BulkProvider`);
  }

  return context;
};

interface IBulkProvider {
  children: ReactNode;
}

export const BulkProvider = ({ children }: IBulkProvider) => {
  const { user } = useAuth();

  const [bulks, setBulks] = useState<Bulk[]>([]);
  const [selectedBulks, setSelectedBulks] = useState<Bulk[]>([]);

  const updateSelectedBulks = useCallback((bulks: Bulk[]) => {
    setSelectedBulks(bulks);
  }, []);

  useEffect(() => {
    let unsubBulks = () => {};

    if (user && db) {
      const bulksRef = collection(db, WINERY, user?.uid as string, BULKS);

      unsubBulks = onSnapshot(bulksRef, (querySnapshot) => {
        const bulks: Bulk[] = [];

        if (querySnapshot.empty) {
          console.log("No bulks found");
          setBulks([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          bulks.push({ ...data, id: data?.id ?? id } as Bulk);
        });

        setBulks(bulks);
      });
    }

    return () => {
      unsubBulks();
      setBulks([]);
    };
  }, [user]);

  const memoizedBulks = useMemo(() => bulks, [bulks]);
  const memoizedSelectedBulks = useMemo(() => selectedBulks, [selectedBulks]);

  return (
    <BulkContext
      value={{
        bulks: memoizedBulks,
        selectedBulks: memoizedSelectedBulks,
        updateSelectedBulks: updateSelectedBulks,
      }}
    >
      {children}
    </BulkContext>
  );
};
