"use client";

import GrapeIntakeActionFormComposer from "@/components/forms/actions/grape/grape-intake-action-form-composer";
import GrapeProcessingActionFormComposer from "@/components/forms/actions/grape/grape-processing-action-form-composer";
import {
  grapeIntakeAction,
  grapeProcessingAction,
} from "@/lib/actions/grape-actions";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { GRAPES, WINERY } from "@/lib/firebase/config";
import { GrapeActions } from "@/models/types/actions";
import { Grape } from "@/models/types/db";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface GrapeContextType {
  grapes: Grape[];
  actions: GrapeActions;
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
  const [actions] = useState<GrapeActions>({
    "grape-intake": {
      exec: grapeIntakeAction,
      form: <GrapeIntakeActionFormComposer />,
      icon: "hugeicons:grapes",
    },
    "grape-processing": {
      exec: grapeProcessingAction,
      form: <GrapeProcessingActionFormComposer />,
      icon: "material-symbols:grain",
    },
  });

  useEffect(() => {
    let unsubGrapes = () => {};

    if (user && db) {
      const grapesRef = collection(db, WINERY, user?.uid as string, GRAPES);

      unsubGrapes = onSnapshot(grapesRef, (querySnapshot) => {
        const grapes: Grape[] = [];

        if (querySnapshot.empty) {
          console.log("No grapes found");
          setGrapes([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          grapes.push({ ...data, id: data?.id ?? id } as Grape);
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

  return (
    <GrapeContext
      value={{
        grapes: memoizedGrapes,
        actions,
      }}
    >
      {children}
    </GrapeContext>
  );
};
