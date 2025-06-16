/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef } from "ag-grid-enterprise";
import { Bulk } from "@/models/types/db";
import { DefaultCellRenderer } from "../DefaultCellRenderer";
import { StatusCellRenderer } from "./StatusCellRenderer";
import { LabDataCellRenderer } from "./LabDataCellRenderer";
import { TasksCellRenderer } from "../tasks-cell-renderer";
import { NotesCellRenderer } from "../NotesCellRenderer";

type MultiCol = Record<keyof Bulk, any>;
export const bulkColumns: ColDef<
  Bulk & {
    statusData: MultiCol;
    groupByStatus: Bulk["status"];
  },
  any
>[] = [
  {
    headerName: "Status",
    field: "statusData",
    minWidth: 100,
    flex: 1,
    editable: false,
    cellRenderer: StatusCellRenderer,
    cellRendererParams: {
      alignItems: "center",
    },
    enableRowGroup: true,
  },
  {
    headerName: "Group: Status",
    field: "groupByStatus",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: (params) => params.data?.statusData?.status,
    keyCreator: (params) => params?.value,
  },
  {
    headerName: "Wine Qty (tonns)",
    field: "qty",
    minWidth: 100,
    flex: 1,
    editable: false,
    cellRenderer: DefaultCellRenderer,
    cellRendererParams: {
      aggField: "qty",
      alignItems: "flex-end",
      shouldAggregate: true,
    },
  },
  {
    headerName: "Lab Data",
    field: "labData",
    minWidth: 250,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: LabDataCellRenderer,
  },
  {
    headerName: "Tasks",
    field: "tasks",
    minWidth: 150,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: TasksCellRenderer,
  },
  {
    headerName: "Notes",
    field: "notes",
    minWidth: 150,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: NotesCellRenderer,
  },
];
