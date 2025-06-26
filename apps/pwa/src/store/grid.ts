import { GroupBy } from "@/models/types/dashboard";
import { create } from "zustand";

interface GridStore {
  groupedField?: GroupBy;
  setGroupedField: (groupedField?: GroupBy) => void;
}

export const useGridStore = create<GridStore>((set) => ({
  groupedField: undefined,
  setGroupedField: (groupedField?: GroupBy) => set({ groupedField }),
}));
