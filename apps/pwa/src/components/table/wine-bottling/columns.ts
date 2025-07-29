
import { ColDef } from "ag-grid-enterprise";
import { LotIdAndStatusCellRenderer } from "./cell-renderers/lot-id-and-status-cell-renderer";
import { QuantityCellRenderer } from "./cell-renderers/quantity-cell-renderer";
import { LocationCellRenderer } from "./cell-renderers/location-cell-renderer";
import { BottlingDateCellRenderer } from "./cell-renderers/bottling-date-cell-renderer";
import { NotesCellRenderer } from "./cell-renderers/notes-cell-renderer";

export const columns: ColDef[] = [
  {
    headerName: "Lot ID & Lot Status",
    field: "lotId",
    minWidth: 224,
    flex: 1,
    cellRenderer: LotIdAndStatusCellRenderer,
    aggFunc: ({ values }: any) => values,
    filter: "agSetColumnFilter",
  },
  {
    headerName: "Quantity Overview",
    field: "numberOfBottles",
    minWidth: 264,
    flex: 1,
    cellRenderer: QuantityCellRenderer,
    aggFunc: ({ values }: any) => values,
    filter: "agSetColumnFilter",
  },
  {
    field: "lotStatus",
    minWidth: 224,
    flex: 1,
    cellRenderer: LotIdAndStatusCellRenderer,
    aggFunc: ({ values }: any) => values,
    hide: true,
  },
  {
    headerName: "Bottling Date",
    field: "executionDate",
    minWidth: 156,
    flex: 1,
    cellRenderer: BottlingDateCellRenderer,
    aggFunc: ({ values }: any) => values,
  },
  {
    headerName: "Collection Location",
    field: "bottlingLine",
    minWidth: 172,
    flex: 1,
    cellRenderer: LocationCellRenderer,
    aggFunc: ({ values }: any) => values,
  },
  {
    field: "tasks",
    minWidth: 124,
    flex: 1,
    cellRenderer: "agCellRenderer",
  },
  {
    field: "notes",
    minWidth: 224,
    flex: 1,
    cellRenderer: NotesCellRenderer,
  },
];
