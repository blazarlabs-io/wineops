/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CellClassParams,
  ColDef,
  GridApi,
  IRowNode,
  RefreshCellsParams,
  ValueFormatterParams,
} from "ag-grid-enterprise";
import { IFile } from "./fileUtils";

export let potentialParent: any = null;

const valueFormatter = function (params: ValueFormatterParams) {
  return params.value ? params.value + " MB" : "";
};

const cellClassRules = {
  "hover-over": (params: CellClassParams) => {
    return params.node === potentialParent;
  },
};

export function setPotentialParentForNode(
  api: GridApi<IFile>,
  overNode: IRowNode<IFile> | undefined | null
) {
  let newPotentialParent: IRowNode<IFile> | null = null;
  if (overNode) {
    if (overNode.data?.type === "folder") {
      // over a folder, we take the immediate row
      newPotentialParent = overNode;
    } else if (overNode.parent) {
      // over a file, we take the parent row (which will be a folder)
      newPotentialParent = overNode.parent;
    }
  }
  const alreadySelected = potentialParent === newPotentialParent;
  if (alreadySelected) {
    return; // no change
  }
  // we refresh the previous selection (if it exists) to clear
  // the highlighted and then the new selection.
  const rowsToRefresh = [];
  if (potentialParent) {
    rowsToRefresh.push(potentialParent);
  }
  if (newPotentialParent) {
    rowsToRefresh.push(newPotentialParent);
  }
  potentialParent = newPotentialParent;
  refreshRows(api, rowsToRefresh);
}

function refreshRows(api: GridApi, rowsToRefresh: IRowNode<IFile>[]) {
  const params: RefreshCellsParams<IFile> = {
    // refresh these rows only.
    rowNodes: rowsToRefresh,
    // because the grid does change detection, the refresh
    // will not happen because the underlying value has not
    // changed. to get around this, we force the refresh,
    // which skips change detection.
    force: true,
  };
  api.refreshCells(params);
}

export const columns: ColDef[] = [
  {
    field: "dateModified",
    cellClassRules: cellClassRules,
  },
  {
    field: "size",
    valueFormatter: valueFormatter,
    cellClassRules: cellClassRules,
  },
];
