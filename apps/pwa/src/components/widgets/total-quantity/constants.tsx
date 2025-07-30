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
    color: "transparent",
    darkColor: "transparent",
  },
};

type PatternColor = keyof typeof TOTAL_QUANTITY_COLORS;

export const getStripedPatterns = (colors: PatternColor[] = []) =>
  Object.entries(TOTAL_QUANTITY_COLORS)
    .filter(([name]) => colors.length === 0 || colors.includes(name))
    .map(([name, { darkColor = "", lightColor = "" }]) => {
      return (
        <pattern
          key={name}
          id={`StripedPattern-${name}`}
          patternUnits="userSpaceOnUse"
          width="16"
          height="16"
          patternTransform="rotate(45)"
        >
          <rect width="8" height="16" fill={`${darkColor}`} />
          <rect x="8" width="8" height="16" fill={`${lightColor}`} />
        </pattern>
      );
    });
