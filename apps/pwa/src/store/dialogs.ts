import { create } from "zustand";

type DialogKey =
  | "group-entities"
  | "ungroup-entities"
  | "delete-entities"
  | "form-drawer"
  | "delete-entity-data";

type DialogFn = (key: DialogKey) => void;

interface DialogDrawerStore {
  dialogs: Record<DialogKey, boolean>;
  open: DialogFn;
  close: DialogFn;
  toggle: DialogFn;
}

export const useDialogDrawerStore = create<DialogDrawerStore>((set) => ({
  dialogs: {
    "group-entities": false,
    "ungroup-entities": false,
    "delete-entities": false,
    "form-drawer": false,
    "delete-entity-data": false,
  },
  open: (key) =>
    set(({ dialogs }) => ({ dialogs: { ...dialogs, [key]: true } })),
  close: (key) =>
    set(({ dialogs }) => ({ dialogs: { ...dialogs, [key]: false } })),
  toggle: (key) =>
    set(({ dialogs }) => ({
      dialogs: { ...dialogs, [key]: !dialogs[key] },
    })),
}));
