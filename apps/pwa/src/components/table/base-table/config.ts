/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CellClassParams,
  ColDef,
  ColGroupDef,
  GridApi,
  IRowNode,
  RefreshCellsParams,
  ValueFormatterParams,
} from "ag-grid-enterprise";
import { IFile } from "./fileUtils";
import { EntryCellRenderer } from "./entry-cell-renderer";

export let potentialParent: any = null;

const valueFormatter = function (params: ValueFormatterParams) {
  return params.value ? params.value + " MB" : "";
};

export const cellClassRules = {
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
    if (overNode.data?.rowType === "group") {
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

export const columns: (ColDef | ColGroupDef)[] = [
  {
    headerName: "ENTRY",
    /*children: [
      {
        field: "item",
        headerName: "ALL DATA",
        cellClassRules,

        rowGroup: false,
        hide: false,

        enableValue: false,
        enableRowGroup: false,
        //enablePivot: false,

        //keyCreator: ({ value }) => {
          //return value?.location1 ?? value;
        //},
        cellRenderer: EntryCellRenderer,
      },
      {
        hide: true,
        //enableValue: false,
        //enableRowGroup: false,
        //enablePivot: false,
        field: "entry.status",
        headerName: "Status",
        keyCreator: ({ value }) => {
          console.log("keyCreator:value.status:", value?.status);
          console.log("keyCreator:value:", value);
          return value?.status ?? value;
        },
      },
      {
        hide: true,
        field: "entry.date1",
        headerName: "Date",
        keyCreator: ({ value }) => {
          console.log("keyCreator:value.date1:", value?.date1);
          console.log("keyCreator:value:", value);
          return value?.date1 ?? value;
        },
      },
      {
        hide: true,
        field: "entry.location1",
        headerName: "Location",
        keyCreator: ({ value }) => {
          console.log("keyCreator:value.location1:", value?.location1);
          console.log("keyCreator:value:", value);
          return value?.location1 ?? value;
        },
      },
    ],*/
    field: "item",
    cellClassRules,

    rowGroup: false,
    hide: false,

    enableValue: true,
    enableRowGroup: true,
    //enablePivot: true,

    /*keyCreator: ({ value }) => {
      return value?.location1 ?? value;
    },*/
    cellRenderer: EntryCellRenderer,
  },
  {
    field: "dateModified",
    cellClassRules,

    enableValue: true,
    enableRowGroup: true,
    //enablePivot: true,
  },
  {
    headerName: "Location",
    field: "location",
    cellClassRules,

    rowGroup: false,
    hide: false,

    enableValue: true,
    enableRowGroup: true,
    //enablePivot: true,
  },
  {
    field: "size",
    valueFormatter,
    cellClassRules,

    enableValue: true,
    enableRowGroup: true,
    //enablePivot: true,

    //pivot: true,
  },
  /*{
    headerName: "agg-size",
    field: "size",
    aggFunc: "sum",
  },*/
];
