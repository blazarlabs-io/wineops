import { LabReport, UploadedDocument } from "@/models/types/db";
import { create } from "zustand";

export type SelectedItem = "UNKNOWN" | "labReport" | "document";

interface SelectedItemsStore<T> {
  itemType: SelectedItem;
  selectedItems: T[];
  setSelectedItems: (selectedItems: T[], itemType?: SelectedItem) => void;
}

const createSelectedItemsStore = <T>() =>
  create<SelectedItemsStore<T>>((set) => ({
    itemType: "UNKNOWN",
    selectedItems: [],
    setSelectedItems: (
      selectedItems: T[],
      itemType: SelectedItem = "UNKNOWN"
    ) => set({ selectedItems, itemType }),
  }));

export const useSelectedItemsStore = createSelectedItemsStore<
  UploadedDocument | LabReport
>();
