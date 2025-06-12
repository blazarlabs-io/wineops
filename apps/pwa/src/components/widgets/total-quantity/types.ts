import { EntityStatus } from "@/models/types/dashboard";
import { Metric } from "@/models/types/db";

export type MetricsTotal = Partial<Record<Metric, number>> & {
  status?: EntityStatus;
  vineyard?: string;
};

export type MetricsOutput = Partial<MetricsTotal> & {
  max: number;
  maxu: number;

  sur: number;
  def: number;
  ar: number;
  co: number;

  green: number;
  red: number;
  grey: number;

  stripedGreen: number;
  stripedRed: number;
  stripedGrey: number;

  white: number;
};

export type MetricsOutput2 = {
  barPercent: number;

  greenPercent: number;
  redPercent: number;
  greyPercent: number;
  whitePercent: number;

  stripedGreenPercent: number;
  stripedRedPercent: number;
  stripedGreyPercent: number;

  sur: number;
  def: number;
  ar: number;
  co: number;
};
