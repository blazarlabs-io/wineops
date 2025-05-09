import { VineyardStatus } from '@/models/types/db';
import { Metric } from './constants';

export interface Colors {
  unit?: string;
  color: string;
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
