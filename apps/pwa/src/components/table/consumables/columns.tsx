
import { ColDef } from "ag-grid-enterprise";
import { Consumable } from "@/models/types/db";
import { DefaultCellRenderer } from "../DefaultCellRenderer";
import { InUseWeekCellRenderer } from "./InUseWeekCellRenderer";
import { InUseTodayCellRenderer } from "./InUseTodayCellRenderer";

export const consumableColumns: ColDef<
  Consumable & {
    inUseToday: number;
    inUseThisWeek: number;
  },
  any
>[] = [
  {
    headerName: "Name",
    field: "name",
    minWidth: 150,
    flex: 1,
    editable: false,
    cellRenderer: DefaultCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Consumable ID",
    field: "consumableID",
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: DefaultCellRenderer,
    aggFunc: (params) => params.values,
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
    aggFunc: (params) => params.values,
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
    aggFunc: (params) => params.values,
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
    aggFunc: (params) => params.values,
  },
];
