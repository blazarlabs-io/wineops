"use client";

import { AgGridReact } from "ag-grid-react";
import { createContext, ReactNode, useContext, useState } from "react";

interface ToolsbarContextInterface {
  findSearchValue: string;
  updateSearchValue: (value: string) => void;
  activeMatchNum: string;
  updateActiveMatchNum: (value: string) => void;
  gridRef: AgGridReact | null;
  updateGridRef: (ref: AgGridReact) => void;
}

const ToolsbarContext = createContext<ToolsbarContextInterface | null>(null);

export const useToolsbar = () => {
  const context = useContext(ToolsbarContext);

  if (!context) {
    throw new Error(`'useToolsbar' was used outside of Provider`);
  }

  return context;
};

interface IQuickDrawerProvider {
  children: ReactNode;
}

export const ToolsbarProvider = ({ children }: IQuickDrawerProvider) => {
  const [gridRef, setGridRef] = useState<AgGridReact | null>(null);
  const [findSearchValue, setFindSearchValue] = useState<string>("e");
  const [activeMatchNum, setActiveMatchNum] = useState<string>("");

  const updateSearchValue = (value: string) => {
    setFindSearchValue(() => value);
  };
  const updateActiveMatchNum = (value: string) => {
    setActiveMatchNum(() => value);
  };

  const updateGridRef = (ref: AgGridReact) => {
    setGridRef(() => ref);
  };

  return (
    <ToolsbarContext
      value={{
        findSearchValue,
        updateSearchValue,
        activeMatchNum,
        updateActiveMatchNum,
        gridRef,
        updateGridRef,
      }}
    >
      {children}
    </ToolsbarContext>
  );
};
