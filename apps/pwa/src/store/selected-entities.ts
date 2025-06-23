import { DashboardEntity } from "@/models/types/dashboard";
import { EntityName } from "@/models/types/db";
import { create } from "zustand";

interface SelectedEntitiesStore<T> {
  entityName: EntityName;
  selected: T[];
  setSelected: (selected: T[], entityName?: EntityName) => void;
}

const createSelectedEntitiesStore = <T>() =>
  create<SelectedEntitiesStore<T>>((set) => ({
    entityName: "UNKNOWN",
    selected: [],
    setSelected: (selected: T[], entityName?: EntityName) =>
      set({ selected, entityName: entityName || "UNKNOWN" }),
  }));

export const useSelectedEntitiesStore =
  createSelectedEntitiesStore<DashboardEntity>();
