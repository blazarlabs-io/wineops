import { ActionsEntity } from "@/models/types/actions";
import { Vineyard } from "@/models/types/db";
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
  value?: DialogValueMap[T],
  vineyard?: Vineyard,
) => void;

interface DialogDrawerStore {
  dialogs: DialogValueMap;
  open: DialogFn;
  close: DialogFn;
  toggle: DialogFn;
  vineyard?: Vineyard | undefined;
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
  open: (key, value, vineyard) =>
    set(({ dialogs }) => ({
      dialogs: { ...dialogs, [key]: value ? value : true },
      vineyard,
    })),
  close: (key) =>
    set(({ dialogs }) => ({
      dialogs: { ...dialogs, [key]: false },
      vineyard: undefined,
    })),
  toggle: (key) =>
    set(({ dialogs }) => ({
      dialogs: { ...dialogs, [key]: !dialogs[key] },
    })),
}));
