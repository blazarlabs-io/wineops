
import { ColDef } from "ag-grid-enterprise";
import { Chemistry } from "@/models/types/db";
import { DefaultCellRenderer } from "../DefaultCellRenderer";
import { InUseWeekCellRenderer } from "./InUseWeekCellRenderer";
import { InUseTodayCellRenderer } from "./InUseTodayCellRenderer";

export const chemistryColumns: ColDef<
  Chemistry & {
    inUseToday: number;
    inUseThisWeek: number;
  },
  any
>[] = [
  {
    headerName: "Chemistry ID",
    field: "chemistryID",
    minWidth: 150,
    flex: 1,
    editable: false,
    cellRenderer: DefaultCellRenderer,
  },
  {
    headerName: "Type",
    field: "type",
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: DefaultCellRenderer,
    enableRowGroup: true,
    rowGroup: false,
  },
  {
    headerName: "Quantity",
    field: "qty",
    minWidth: 100,
    flex: 1,
    editable: false,
    cellRenderer: DefaultCellRenderer,
    cellRendererParams: {
      alignItems: "flex-end",
    },
  },
  {
    headerName: "Dosage",
    field: "dosage",
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: DefaultCellRenderer,
  },
  {
    headerName: "In use / today",
    field: "inUseToday",
    minWidth: 150,
    flex: 1,
    editable: false,
    cellRenderer: InUseTodayCellRenderer,
    cellRendererParams: {
      alignItems: "flex-end",
    },
  },
  {
    headerName: "Planned this week",
    field: "inUseThisWeek",
    minWidth: 150,
    flex: 1,
    editable: false,
    cellRenderer: InUseWeekCellRenderer,
    cellRendererParams: {
      alignItems: "flex-end",
    },
  },
];
