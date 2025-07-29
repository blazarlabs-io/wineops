
import { ColDef } from "ag-grid-enterprise";
import { Grape } from "@/models/types/db";
import { BatchIDCellRenderer } from "./BatchIDCellRenderer";
import { QuantityCellRenderer } from "../QuantityCellRenderer";
import { SupplierCellRenderer } from "./SupplierCellRenderer";
import { LabDataCellRenderer } from "./LabDataCellRenderer";
import { NotesCellRenderer } from "../NotesCellRenderer";
import formatDate from "@/utils/date-format";
import { TasksCellRenderer } from "../tasks-cell-renderer";

type MultiCol = Record<keyof Grape, any>;

export const grapesColumns: ColDef<
  Grape & {
    batchId: MultiCol;
    groupByDate: any;
    groupByVariety: any;
    groupByLocation: any;
  },
  any
>[] = [
  {
    headerName: "Group: Date",
    field: "groupByDate",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: (params) =>
      params.data?.date &&
      formatDate(params.data?.date, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    keyCreator: (params) => params?.value,
  },
  {
    headerName: "Group: Variety",
    field: "groupByVariety",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: (params) => params?.data?.grapeVariety,
    keyCreator: (params) => params?.value,
  },
  {
    headerName: "Group: Location",
    field: "groupByLocation",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: (params) => params?.data?.location,
    keyCreator: (params) => params?.value,
  },
  {
    headerName: "Batch ID",
    field: "batchId",
    minWidth: 160,
    flex: 1,
    editable: false,
    cellRenderer: BatchIDCellRenderer,
  },
  {
    headerName: "Quantity Overview",
    field: "metrics",
    minWidth: 230,
    flex: 1,
    editable: false,
    cellRenderer: QuantityCellRenderer,
  },
  {
    headerName: "Supplier",
    field: "supplier",
    minWidth: 150,
    flex: 1,
    editable: false,
    cellRenderer: SupplierCellRenderer,
  },
  {
    headerName: "Lab Results",
    field: "labData",
    minWidth: 200,
    flex: 1,
    cellRenderer: LabDataCellRenderer,
  },
  {
    headerName: "Tasks",
    field: "tasks",
    minWidth: 150,
    flex: 1,
    cellRenderer: TasksCellRenderer,
  },
  {
    headerName: "Notes",
    field: "notes",
    minWidth: 150,
    flex: 1,
    cellRenderer: NotesCellRenderer,
  },
];
