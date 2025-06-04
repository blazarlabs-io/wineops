import { ColDef } from "ag-grid-enterprise";
import { Grape, Must } from "@/models/types/db";
import { QuantityCellRenderer } from "./cell-renderers/quantity-cell-renderer";
import { LabDataCellRenderer } from "./cell-renderers/lab-data-cell-renderer";
import { NotesCellRenderer } from "./NotesCellRenderer";
import { TasksCellRenderer } from "./cell-renderers/tasks-cell-renderer";
// import { BatchIDCellRenderer } from "./BatchIDCellRenderer";
// import { QuantityCellRenderer } from "./QuantityCellRenderer";
// import { SupplierCellRenderer } from "./SupplierCellRenderer";
// import { LabDataCellRenderer } from "./LabDataCellRenderer";
// import { NotesCellRenderer } from "./NotesCellRenderer";

export const mustColumns: ColDef[] = [
  {
    headerName: "Must ID",
    field: "vesselId",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    editable: false,
    // cellRenderer: BatchIDCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Status",
    field: "vesselId",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    editable: false,
    // cellRenderer: BatchIDCellRenderer,
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
    headerName: "Lab",
    field: "labData",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: LabDataCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    field: "tasks",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: TasksCellRenderer,
    // aggFunc: (params) => params.values,
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
