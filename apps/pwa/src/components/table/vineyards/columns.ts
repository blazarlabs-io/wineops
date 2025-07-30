import { ColDef } from "ag-grid-enterprise";
import { TasksCellRenderer } from "../tasks-cell-renderer";
import { GrapeVarietyCellRenderer } from "./cell-renderers/grape-variety-cell-renderer";
import { LabDataCellRenderer } from "./cell-renderers/lab-data-cell-renderer";
import { NotesCellRenderer } from "./cell-renderers/notes-cell-renderer";
import { QuantityCellRenderer } from "./cell-renderers/quantity-cell-renderer";
import { StatusCellRenderer } from "./cell-renderers/status-cell-renderer";
import { TestRenderer } from "./cell-renderers/test-renderer";

export const vineyardColumns: ColDef[] = [
  {
    field: "grapeVariety",
    minWidth: 164,
    flex: 1,
    cellRenderer: GrapeVarietyCellRenderer,
    aggFunc: ({ values }: any) => values,
    filter: "agSetColumnFilter",
  },
  {
    field: "status",
    minWidth: 184,
    flex: 1,
    cellRenderer: StatusCellRenderer,
    aggFunc: ({ values }: any) => values,
    filter: "agSetColumnFilter",
  },
  {
    headerName: "Quantity Overview",
    field: "forcastedYield",
    minWidth: 264,
    flex: 1,
    cellRenderer: QuantityCellRenderer,
  },
  {
    field: "labData",
    minWidth: 196,
    flex: 1,
    cellRenderer: LabDataCellRenderer,
  },
  {
    field: "tasks",
    minWidth: 124,
    flex: 1,
    cellRenderer: TasksCellRenderer,
    aggFunc: ({ values }: any) => values,
  },
  {
    field: "notes",
    minWidth: 224,
    flex: 1,
    cellRenderer: NotesCellRenderer,
  },
  {
    field: "cadastralNumber",
    hide: true,
    aggFunc: ({ values }: any) => values,
  },
];
