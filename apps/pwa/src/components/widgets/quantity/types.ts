import { Metric, VineyardStatus } from "@/models/types/db";

export interface Colors {
  unit?: string;
  color?: string;
  markerColor?: string;
  textColor?: string;
  lightColor?: string;
  darkColor?: string;
  secondaryLightColor?: string;
  secondaryDarkColor?: string;
}

export type SortedValueWithColor = Colors & {
  type: Metric;
  value: number;
  status?: VineyardStatus;
};
