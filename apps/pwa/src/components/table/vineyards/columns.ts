/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef, ISelectCellEditorParams } from "ag-grid-enterprise";
import { GrapeVarietyCellRenderer } from "./cell-renderers/grape-variety-cell-renderer";
import { LabDataCellRenderer } from "./cell-renderers/lab-data-cell-renderer";
import { NotesCellRenderer } from "./cell-renderers/notes-cell-renderer";
import { QuantityCellRenderer } from "./cell-renderers/quantity-cell-renderer";
import { StatusCellRenderer } from "./cell-renderers/status-cell-renderer";
import { TasksCellRenderer } from "./cell-renderers/tasks-cell-renderer";
import { StatusSelectCellRenderer } from "./cell-renderers/status-select-cell-renderer";
import { vineyardStatus } from "@/data/system-variables";

export const vineyardColumns: ColDef[] = [
  {
    field: "grapeVariety",
    minWidth: 164,
    flex: 1,
    cellRenderer: GrapeVarietyCellRenderer,
    cellStyle: { width: "100%" },
    aggFunc: (params: any) => {
      const grapes = params.values.map((value: any) => {
        return value;
      });
      return grapes;
    },
  },
  {
    field: "status",
    minWidth: 148,
    flex: 1,
    cellRenderer: StatusSelectCellRenderer,
    cellEditor: "agRichSelectCellEditor",
    // cellRendererParams: (params: any) => {
    //   return params;
    // },
    cellStyle: { width: "100%" },
    editable: true,
    cellEditorPopup: true,
    cellEditorParams: {
      values: vineyardStatus,
      singleClickEdit: true,
      cellRenderer: StatusSelectCellRenderer,
      valueListMaxWidth: 200,
      valueListGap: 10,
    } as ISelectCellEditorParams,
  },
  {
    field: "forcastedYield",
    minWidth: 240,
    flex: 1,
    cellRenderer: QuantityCellRenderer,
    cellStyle: { width: "100%" },
  },
  {
    field: "labData",
    minWidth: 196,
    flex: 1,
    cellRenderer: LabDataCellRenderer,
    cellStyle: { width: "100%" },
    // aggFunc: (params: any) => {
    //   return params.values;
    // },
  },
  {
    field: "tasks",
    minWidth: 124,
    flex: 1,
    cellRenderer: TasksCellRenderer,
    cellStyle: { width: "100%" },
    aggFunc: (params: any) => {
      return params.values;
    },
  },
  {
    field: "notes",
    minWidth: 196,
    flex: 1,
    cellRenderer: NotesCellRenderer,
    cellStyle: { width: "100%" },
  },
  {
    field: "cadastralNumber",
    hide: true,
    aggFunc: (params: any) => {
      return params.values;
    },
  },
];
