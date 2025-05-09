import { Group } from '@/models/types/db';
import vineyardBlankSample from './vineyard-blank-sample';

export const groupSample: Group = {
  ...vineyardBlankSample,
  grouping: {
    items: [],
  },
};
