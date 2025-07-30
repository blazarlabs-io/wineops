"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextType {
  openSidebar: boolean;
  updateOpenSidebar: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(`'useSidebar' was used outside of VineyardProvider`);
  }

  return context;
};

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);

  const updateOpenSidebar = (open: boolean) => {
    setOpenSidebar(open);
  };
  return (
    <SidebarContext.Provider
      value={{
        openSidebar,
        updateOpenSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
