"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { GRAPES, WINERY } from "@/lib/firebase/config";
import { Grape } from "@/models/types/db";
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

interface GrapeContextType {
  grapes: Grape[];
  selectedGrapes: Grape[];
  updateSelectedGrapes: (grapes: Grape[]) => void;
}

const GrapeContext = createContext<GrapeContextType | null>(null);

export const useGrape = () => {
  const context = useContext(GrapeContext);

  if (!context) {
    throw new Error(`'useGrape' was used outside of GrapeProvider`);
  }

  return context;
};

interface IGrapeProvider {
  children: ReactNode;
}

export const GrapeProvider = ({ children }: IGrapeProvider) => {
  const { user } = useAuth();

  const [grapes, setGrapes] = useState<Grape[]>([]);
  const [selectedGrapes, setSelectedGrapes] = useState<Grape[]>([]);

  const updateSelectedGrapes = useCallback((grapes: Grape[]) => {
    setSelectedGrapes(grapes);
  }, []);

  useEffect(() => {
    let unsubGrapes = () => {};

    if (user && db) {
      const grapesRef = collection(db, WINERY, user?.uid as string, GRAPES);

      unsubGrapes = onSnapshot(grapesRef, (querySnapshot) => {
        const grapes: Grape[] = [];

        if (querySnapshot.empty) {
          console.log("No grapes found");
          return;
        }

        querySnapshot.forEach((doc) => {
          grapes.push(doc.data() as Grape);
        });

        setGrapes(grapes);
      });
    }

    return () => {
      unsubGrapes();
      setGrapes([]);
    };
  }, [user]);

  const memoizedGrapes = useMemo(() => grapes, [grapes]);
  const memoizedSelectedGrapes = useMemo(
    () => selectedGrapes,
    [selectedGrapes]
  );

  return (
    <GrapeContext
      value={{
        grapes: memoizedGrapes,
        selectedGrapes: memoizedSelectedGrapes,
        updateSelectedGrapes,
      }}
    >
      {children}
    </GrapeContext>
  );
};
