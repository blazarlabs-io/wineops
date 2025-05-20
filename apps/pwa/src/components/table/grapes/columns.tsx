/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef } from "ag-grid-enterprise";
import { Grape } from "@/models/types/db";
import { BatchIDCellRenderer } from "./BatchIDCellRenderer";
import { QuantityCellRenderer } from "./QuantityCellRenderer";
import { SupplierCellRenderer } from "./SupplierCellRenderer";
import { LabDataCellRenderer } from "./LabDataCellRenderer";
import { NotesCellRenderer } from "./NotesCellRenderer";

type MultiCol = Record<keyof Grape, any>;

export const grapesColumns: ColDef<
  Grape & {
    batchId: MultiCol;
  },
  any
>[] = [
  {
    headerName: "Batch ID",
    field: "batchId",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    editable: false,
    cellRenderer: BatchIDCellRenderer,
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
    field: "supplier",
    minWidth: 150,
    flex: 1,
    cellStyle: { width: "100%" },
    editable: false,
    cellRenderer: SupplierCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Lab",
    field: "labData",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: LabDataCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    field: "notes",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: NotesCellRenderer,
    aggFunc: (params) => params.values,
  },
];
