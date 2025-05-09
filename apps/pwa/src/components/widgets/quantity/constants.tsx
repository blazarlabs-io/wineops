import { Colors } from './types';

export const Metric = {
  ACTUAL: 'actual',
  SUPPLY: 'supply',
  DEMAND: 'demand',
} as const;

export type Metric = (typeof Metric)[keyof typeof Metric];

type QuantityColors = Record<Metric, Colors>;

export const QUANTITY_COLORS: QuantityColors = {
  actual: {
    color: '#D9D9D9',
    markerColor: '#787878',
    textColor: '#000',
    lightColor: '#DBDBDB',
    darkColor: '#B9B9B9',
  },
  supply: { color: '#35C8D2' },
  demand: {
    color: '#FF7878',
    lightColor: '#FFBDBD',
    darkColor: '#FF7878',
    secondaryLightColor: '#C2FFBA',
    secondaryDarkColor: '#76F466',
  },
};
