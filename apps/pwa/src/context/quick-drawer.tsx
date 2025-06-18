"use client";

import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { CHEMISTRY, WINERY } from "@/lib/firebase/config";
import { Chemistry } from "@/models/types/db";
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

interface QuickDrawerContextType {
  open: boolean;
  updateOpen: (open: boolean) => void;
  type: "tasks" | "actions";
}

const QuickDrawerContext = createContext<QuickDrawerContextType | null>(null);

export const useChemistry = () => {
  const context = useContext(QuickDrawerContext);

  if (!context) {
    throw new Error(`'useQuickDrawer' was used outside of Provider`);
  }

  return context;
};

interface IQuickDrawerProvider {
  children: ReactNode;
}

export const QuickDrawerProvider = ({ children }: IQuickDrawerProvider) => {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<"tasks" | "actions">("actions");

  // const update

  useEffect(() => {
    if (user && db) {
    }

    return () => {};
  }, [user]);

  return (
    <QuickDrawerContext
      value={{
        open,
        updateOpen: setOpen,
        type,
      }}
    >
      {children}
    </QuickDrawerContext>
  );
};
