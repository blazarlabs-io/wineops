/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef } from "ag-grid-enterprise";
import { Must } from "@/models/types/db";
import { VesselIDCellRenderer } from "./VesselIDCellRenderer";
import { QuantityCellRenderer } from "../QuantityCellRenderer";
import { LabDataCellRenderer } from "./LabDataCellRenderer";
import { NotesCellRenderer } from "../NotesCellRenderer";
import { StatusCellRenderer } from "./StatusCellRenderer";
import { TasksCellRenderer } from "../tasks-cell-renderer";

type MultiCol = Record<keyof Must, any>;

export const mustColumns: ColDef<
  Must & {
    mustID: MultiCol;
    statusData: MultiCol;
  },
  any
>[] = [
  {
    headerName: "Must ID",
    field: "mustID",
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: VesselIDCellRenderer,
    aggFunc: (params) => params.values,
  },
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
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Quantity",
    field: "metrics",
    minWidth: 240,
    flex: 1,
    cellStyle: { width: "100%" },
    editable: false,
    cellRenderer: QuantityCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Labs",
    field: "labData",
    minWidth: 250,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: LabDataCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Tasks",
    field: "tasks",
    minWidth: 150,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: TasksCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Notes",
    field: "notes",
    minWidth: 150,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: NotesCellRenderer,
    aggFunc: (params) => params.values,
  },
];
