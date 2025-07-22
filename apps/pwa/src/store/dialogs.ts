import { ActionsEntity } from "@/models/types/actions";
import { create } from "zustand";

type DialogKey =
  | "group-entities"
  | "ungroup-entities"
  | "delete-entities"
  | "form-drawer"
  | "delete-entity-data"
  | "action-drawer";

type DialogValueMap = {
  "group-entities": boolean;
  "ungroup-entities": boolean;
  "delete-entities": boolean;
  "form-drawer": boolean;
  "delete-entity-data": boolean;
  "action-drawer": boolean | ActionsEntity;
};

type DialogFn = <T extends DialogKey>(
  key: T,
  value?: DialogValueMap[T]
) => void;

interface DialogDrawerStore {
  dialogs: DialogValueMap;
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
    "action-drawer": false,
  },
  open: (key, value) =>
    set(({ dialogs }) => ({
      dialogs: { ...dialogs, [key]: value ? value : true },
    })),
  close: (key) =>
    set(({ dialogs }) => ({ dialogs: { ...dialogs, [key]: false } })),
  toggle: (key) =>
    set(({ dialogs }) => ({
      dialogs: { ...dialogs, [key]: !dialogs[key] },
    })),
}));
