"use client";

import GrapeIntakeActionFormComposer from "@/components/forms/actions/grape/grape-intake-action-form-composer";
import GrapeProcessingActionFormComposer from "@/components/forms/actions/grape/grape-processing-action-form-composer";
import {
  grapeIntakeAction,
  grapeProcessingAction,
} from "@/lib/actions/grape-actions";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { GRAPES, LAB_REPORTS, WINERY } from "@/lib/firebase/config";
import { GrapeActions } from "@/models/types/actions";
import { Grape, LabReport } from "@/models/types/db";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
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
  labReports: LabReport[];
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
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [actions] = useState<GrapeActions>({
    "grape-intake": {
      exec: grapeIntakeAction,
      form: GrapeIntakeActionFormComposer,
      icon: "hugeicons:grapes",
    },
    "grape-processing": {
      exec: grapeProcessingAction,
      form: GrapeProcessingActionFormComposer,
      icon: "material-symbols:grain",
    },
  });

  useEffect(() => {
    let unsubGrapes = () => {};
    let unsubLabReports = () => {};

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

      // * Lab Reports Realtime Updates
      const labReportsRef = collection(
        db,
        WINERY,
        user?.uid as string,
        LAB_REPORTS
      );

      unsubLabReports = onSnapshot(labReportsRef, (querySnapshot) => {
        const labReports: LabReport[] = [];

        if (querySnapshot.empty) {
          console.log("No lab reports found");
          setLabReports([]);
          return;
        }

        querySnapshot.forEach((doc) => {
          labReports.push(doc.data() as LabReport);
          // sort reports by date
          labReports.sort((a, b) => {
            return (
              (b.date as Timestamp).toDate().getTime() -
              (a.date as Timestamp).toDate().getTime()
            );
          });
        });
        setLabReports(labReports);
      });
    }

    return () => {
      unsubGrapes();
      setGrapes([]);
      unsubLabReports();
    };
  }, [user]);

  const memoizedGrapes = useMemo(() => grapes, [grapes]);

  return (
    <GrapeContext
      value={{
        grapes: memoizedGrapes,
        actions,
        labReports,
      }}
    >
      {children}
    </GrapeContext>
  );
};
