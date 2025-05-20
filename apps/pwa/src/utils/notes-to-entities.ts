import { IRowNode } from "ag-grid-community";

export const nodesToEntities = <T>(nodes: IRowNode[]): T[] => {
  if (!nodes || nodes.length === 0) return [];

  return nodes.map(({ data }) => data as T);
};
