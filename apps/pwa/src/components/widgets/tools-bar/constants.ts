export type ButtonProps = {
  enabled?: boolean;
  onClick?: () => void;
};

export const ButtonType = {
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete",
  GROUP: "group",
  UNGROUP: "ungroup",
} as const;

export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];
