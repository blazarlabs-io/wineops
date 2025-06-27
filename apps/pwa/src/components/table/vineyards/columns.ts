/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef } from "ag-grid-enterprise";
import { GrapeVarietyCellRenderer } from "./cell-renderers/grape-variety-cell-renderer";
import { LabDataCellRenderer } from "./cell-renderers/lab-data-cell-renderer";
import { NotesCellRenderer } from "./cell-renderers/notes-cell-renderer";
import { QuantityCellRenderer } from "./cell-renderers/quantity-cell-renderer";
import { StatusCellRenderer } from "./cell-renderers/status-cell-renderer";
import { TasksCellRenderer } from "../tasks-cell-renderer";

export const vineyardColumns: ColDef[] = [
  {
    field: "grapeVariety",
    minWidth: 164,
    flex: 1,
    cellRenderer: GrapeVarietyCellRenderer,
    aggFunc: (params: any) => {
      const grapes = params.values.map((value: any) => {
        return value;
      });

      return grapes;
    },
  },
  {
    field: "status",
    minWidth: 184,
    flex: 1,
    cellRenderer: StatusCellRenderer,
    cellRendererParams: (params: any) => {
      return params;
    },
    aggFunc: (params: any) => {
      const statuses = params.values.map((value: any) => {
        return value;
      });
      return statuses;
    },
  },
  {
    headerName: "Quantity Overview",
    field: "forcastedYield",
    minWidth: 240,
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
    aggFunc: (params: any) => {
      return params.values;
    },
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
    aggFunc: (params: any) => {
      return params.values;
    },
  },
];
