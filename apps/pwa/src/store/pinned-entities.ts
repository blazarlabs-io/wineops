import { DashboardEntity } from "@/models/types/dashboard";
import { EntityName } from "@/models/types/db";
import { create } from "zustand";

interface PinnedEntitiesStore<T> {
  entityName: EntityName;
  pinned: T[];
  setPinned: (selected: T[], entityName?: EntityName) => void;
}

const createPinnedEntitiesStore = <T>() =>
  create<PinnedEntitiesStore<T>>((set) => ({
    entityName: "UNKNOWN",
    pinned: [],
    setPinned: (pinned: T[], entityName?: EntityName) =>
      set({ pinned, entityName: entityName || "UNKNOWN" }),
  }));

export const usePinnedEntitiesStore =
  createPinnedEntitiesStore<DashboardEntity>();
