import { Vineyard } from "@/models/types/db";
import { IRowNode } from "ag-grid-community";

export const nodesToVineyards = (nodes: IRowNode[]) => {
  if (nodes && nodes.length > 0) {
    const vineyards: Vineyard[] = [];
    nodes.map((node: IRowNode) => {
      vineyards.push(node.data);
    });
    return vineyards;
  } else {
    return [];
  }
};
