import { Colors } from "../quantity/types";

export const TOTAL_QUANTITY_COLORS: Record<
  string,
  Pick<Colors, "color" | "lightColor" | "darkColor">
> = {
  default: {
    lightColor: "transparent",
    darkColor: "rgba(0,0,0,0.1)",
  },
  grey: {
    lightColor: "#DBDBDB",
    darkColor: "#B9B9B9",
  },
  green: {
    lightColor: "#C2FFBA",
    darkColor: "#76F466",
  },
  red: {
    lightColor: "#FFBDBD",
    darkColor: "#FF7878",
  },
  white: {
    color: "#FFFFFF",
    darkColor: "#FFFFFF",
  },
};
