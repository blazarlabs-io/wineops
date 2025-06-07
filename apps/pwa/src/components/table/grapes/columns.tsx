/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef } from "ag-grid-enterprise";
import { Grape } from "@/models/types/db";
import { BatchIDCellRenderer } from "./BatchIDCellRenderer";
import { QuantityCellRenderer } from "../QuantityCellRenderer";
import { SupplierCellRenderer } from "./SupplierCellRenderer";
import { LabDataCellRenderer } from "./LabDataCellRenderer";
import { NotesCellRenderer } from "../NotesCellRenderer";
import formatDate from "@/utils/date-format";

type MultiCol = Record<keyof Grape, any>;

export const grapesColumns: ColDef<
  Grape & {
    batchId: MultiCol;
    groupByDate: any;
    groupByVariety: any;
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
    keyCreator: (params) => params?.value || "Unknown date",
  },
  {
    headerName: "Group: Variety",
    field: "groupByVariety",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: (params) => params?.data?.grapeVariety,
    keyCreator: (params) => params?.value || "Unknown grape variety",
  },
  {
    headerName: "Batch ID",
    field: "batchId",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    editable: false,
    cellRenderer: BatchIDCellRenderer,
  },
  {
    headerName: "Quantity",
    field: "metrics",
    minWidth: 240,
    flex: 1,
    cellStyle: { width: "100%" },
    editable: false,
    cellRenderer: QuantityCellRenderer,
  },
  {
    field: "supplier",
    minWidth: 150,
    flex: 1,
    cellStyle: { width: "100%" },
    editable: false,
    cellRenderer: SupplierCellRenderer,
  },
  {
    headerName: "Lab",
    field: "labData",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: LabDataCellRenderer,
  },
  {
    field: "notes",
    minWidth: 200,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: NotesCellRenderer,
  },
];
