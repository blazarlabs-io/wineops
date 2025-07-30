import { Metric } from "@/models/types/db";
import { Colors } from "./types";

type QuantityColors = Record<Metric, Colors>;

export const QUANTITY_COLORS: QuantityColors = {
  actual: {
    color: "#B9B9B9",
    markerColor: "#787878",
    lightColor: "#DBDBDB",
    darkColor: "#B9B9B9",
    secondaryDarkColor: "#76F466",
  },
  supply: {
    color: "#35C8D2",
    lightColor: "#B9B9B9",
    darkColor: "#FF7878",
    secondaryDarkColor: "#76F466",
  },
  demand: {
    color: "#FF7878",
    lightColor: "#FFBDBD",
    darkColor: "#FF7878",
    secondaryLightColor: "#C2FFBA",
    secondaryDarkColor: "#76F466",
  },
};
