"use client";

import { QuickDrawerType } from "@/models/types/db";
import { createContext, ReactNode, useContext, useState } from "react";

interface QuickDrawerContextType {
  open: boolean;
  updateOpen: (open: boolean) => void;
  type: QuickDrawerType;
  updateType: (type: QuickDrawerType) => void;
  openForm: boolean;
  updateOpenForm: (open: boolean) => void;
}

const QuickDrawerContext = createContext<QuickDrawerContextType | null>(null);

export const useQuickDrawer = () => {
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
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<QuickDrawerType>("actions");
  const [openForm, setOpenForm] = useState(false);

  const updateOpen = (open: boolean) => {
    setOpen(open);
  };
  const updateType = (type: QuickDrawerType) => {
    setType(type);
  };

  const updateOpenForm = (open: boolean) => {
    setOpenForm(open);
  };

  return (
    <QuickDrawerContext
      value={{
        open,
        updateOpen,
        type,
        updateType,
        openForm,
        updateOpenForm,
      }}
    >
      {children}
    </QuickDrawerContext>
  );
};
