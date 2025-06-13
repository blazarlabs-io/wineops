"use client";

import VineyardHarvestActionFormComposer from "@/components/forms/actions/vineyard/vineyard-harvest-action-form-composer";
import VineyardIrrigationActionFormComposer from "@/components/forms/actions/vineyard/vineyard-irrigation-action-form-composer";
import VineyardLabActionFormComposer from "@/components/forms/actions/vineyard/vineyard-lab-action-form-composer";
import {
  vineyardHarvestAction,
  vineyardLabAction,
} from "@/lib/actions/vineyard-actions";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import {
  LAB_REPORTS,
  NOTES,
  VINEYARDS,
  VINEYARDS_GROUPS,
  WINERY,
} from "@/lib/firebase/config";
import { VineyardActions } from "@/models/types/actions";
import { Group, LabReport, Note, Vineyard } from "@/models/types/db";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface VineyardContextType {
  vineyards: Vineyard[];
  selectedVineyards: Vineyard[];
  updateSelectedVineyards: (vineyards: Vineyard[]) => void;
  actions: VineyardActions;
  labReports: LabReport[];
  notes: Note[];
}

const VineyardContext = createContext<VineyardContextType | null>(null);

// hook that we can use anywhere in the app
export const useVineyard = () => {
  const context = useContext(VineyardContext);

  if (!context) {
    throw new Error(`'useVineyard' was used outside of VineyardProvider`);
  }

  return context;
};

interface IAuthProvider {
  children: React.ReactNode;
}

export const VineyardProvider = ({ children }: IAuthProvider) => {
  const { user } = useAuth();

  const [vineyards, setVineyards] = useState<Vineyard[]>([]);
  const [selectedVineyards, setSelectedVineyards] = useState<Vineyard[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [actions] = useState<VineyardActions>({
    harvest: {
      exec: vineyardHarvestAction,
      form: <VineyardHarvestActionFormComposer />,
      icon: "hugeicons:grapes",
    },
    "lab-report": {
      exec: vineyardLabAction,
      form: <VineyardLabActionFormComposer />,
      icon: "material-symbols:lab-profile-outline",
    },
    irrigation: {
      exec: vineyardLabAction,
      form: <VineyardIrrigationActionFormComposer />,
      icon: "material-symbols:water-drop",
    },
  });
  const [notes, setNotes] = useState<Note[]>([]);

  const updateSelectedVineyards = useCallback((vineyards: Vineyard[]) => {
    setSelectedVineyards(vineyards);
  }, []);

  useEffect(() => {
    let unsubVineyards = () => {};
    let unsubLabReports = () => {};
    let unsubNotes = () => {};

    if (user && db) {
      // * Vineyards Realtime Updates
      const vineyardsRef = collection(
        db,
        WINERY,
        user?.uid as string,
        VINEYARDS
      );

      unsubVineyards = onSnapshot(vineyardsRef, (querySnapshot) => {
        const vineyards: Vineyard[] = [];

        if (querySnapshot.empty) {
          console.log("No vineyards found");
          return;
        }

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          vineyards.push({ ...data, id: data?.id ?? id } as Vineyard);
        });

        setVineyards(vineyards);
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
          return;
        }

        querySnapshot.forEach((doc) => {
          labReports.push(doc.data() as LabReport);
        });
        setLabReports(labReports);
      });

      // * Notes Realtime Updates
      const notesRef = collection(db, WINERY, user?.uid as string, NOTES);

      unsubNotes = onSnapshot(notesRef, (querySnapshot) => {
        const notes: Note[] = [];

        if (querySnapshot.empty) {
          console.log("No notes found");
          return;
        }

        querySnapshot.forEach((doc) => {
          notes.push(doc.data() as Note);
        });
        setNotes(notes);
      });
    }

    return () => {
      unsubVineyards();
      unsubLabReports();
      unsubNotes();
      setVineyards([]);
    };
  }, [user]);

  const memoizedVineyards = useMemo(() => vineyards, [vineyards]);
  const memoizedSelectedGrapes = useMemo(
    () => selectedVineyards,
    [selectedVineyards]
  );

  return (
    <VineyardContext.Provider
      value={{
        vineyards: memoizedVineyards,
        selectedVineyards: memoizedSelectedGrapes,
        updateSelectedVineyards,
        actions,
        labReports,
        notes,
      }}
    >
      {children}
    </VineyardContext.Provider>
  );
};
