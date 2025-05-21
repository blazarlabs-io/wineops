import { ColDef } from "ag-grid-enterprise";
import { Grape, Must } from "@/models/types/db";
import { QuantityCellRenderer } from "./QuantityCellRenderer";
import { LabDataCellRenderer } from "./LabDataCellRenderer";
import { NotesCellRenderer } from "./NotesCellRenderer";
// import { BatchIDCellRenderer } from "./BatchIDCellRenderer";
// import { QuantityCellRenderer } from "./QuantityCellRenderer";
// import { SupplierCellRenderer } from "./SupplierCellRenderer";
// import { LabDataCellRenderer } from "./LabDataCellRenderer";
// import { NotesCellRenderer } from "./NotesCellRenderer";

export const mustColumns: ColDef[] = [
  {
    headerName: "Vessel ID",
    field: "vesselId",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    editable: false,
    // cellRenderer: BatchIDCellRenderer,
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
