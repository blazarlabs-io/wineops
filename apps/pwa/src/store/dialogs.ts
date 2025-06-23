import { create } from "zustand";

type DialogKey =
  | "group-entities"
  | "ungroup-entities"
  | "delete-entities"
  | "form-drawer";

interface DialogDrawerStore {
  dialogs: Record<DialogKey, boolean>;
  openDialog: (key: DialogKey) => void;
  closeDialog: (key: DialogKey) => void;
  toggleDialog: (key: DialogKey) => void;
}

export const useDialogDrawerStore = create<DialogDrawerStore>((set) => ({
  dialogs: {
    "group-entities": false,
    "ungroup-entities": false,
    "delete-entities": false,
    "form-drawer": false,
  },
  openDialog: (key) =>
    set((state) => ({ dialogs: { ...state.dialogs, [key]: true } })),
  closeDialog: (key) =>
    set((state) => ({ dialogs: { ...state.dialogs, [key]: false } })),
  toggleDialog: (key) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [key]: !state.dialogs[key] },
    })),
}));
