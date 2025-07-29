export type ButtonProps = {
  enabled?: boolean;
  onClick?: () => void;
  hide?: boolean;
};

export const ButtonType = {
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete",
  GROUP: "group",
  UNGROUP: "ungroup",
  PIN: "pin",
  PIVOT: "pivot",
} as const;

export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];
