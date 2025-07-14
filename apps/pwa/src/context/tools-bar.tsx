/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AgGridReact } from "ag-grid-react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface ToolsbarContextInterface {
  findSearchValue: string;
  updateSearchValue: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  activeMatchNum: string;
  updateActiveMatchNum: (value: string) => void;
  gridRef: any;
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
  const gridRef = useRef<AgGridReact>(null);
  const [findSearchValue, setFindSearchValue] = useState<string>("");
  const [activeMatchNum, setActiveMatchNum] = useState<string>("");

  const updateSearchValue = (value: string) => {
    setFindSearchValue(() => value);
  };
  const updateActiveMatchNum = (value: string) => {
    setActiveMatchNum(() => value);
  };

  const onNext = useCallback(() => {
    console.log("NEXT", gridRef);
    gridRef?.current?.api.findNext();
  }, [gridRef]);

  const onPrevious = useCallback(() => {
    console.log("PREVIOUS", gridRef);
    gridRef?.current?.api.findPrevious();
  }, [gridRef]);

  return (
    <ToolsbarContext
      value={{
        findSearchValue,
        updateSearchValue,
        activeMatchNum,
        updateActiveMatchNum,
        gridRef,
        onNext,
        onPrevious,
      }}
    >
      {children}
    </ToolsbarContext>
  );
};
