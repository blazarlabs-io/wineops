/* eslint-disable @typescript-eslint/no-explicit-any */
import { vineyardStatus } from "@/data/system-variables";
import { ColDef } from "ag-grid-enterprise";
import { GrapeVarietyCellRenderer } from "./cell-renderers/GrapeVarietyCellRenderer";
import { LabDataCellRenderer } from "./cell-renderers/LabDataCellRenderer";
import { NotesCellRenderer } from "./cell-renderers/NotesCellRenderer";
import { QuantityCellRenderer } from "./cell-renderers/QuantityCellRenderer";
import { StatusCellRenderer } from "./cell-renderers/StatusCellRenderer";
import { TasksCellRenderer } from "./cell-renderers/TasksCellRenderer";

export const vineyardColumns: ColDef[] = [
  {
    field: "grapeVariety",
    minWidth: 164,
    flex: 1,
    cellRenderer: GrapeVarietyCellRenderer,
    cellStyle: { width: "100%" },
    editable: true,
    cellEditor: "agRichTextCellEditor",
    aggFunc: (params: any) => {
      console.log("params", params);
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
    cellRenderer: StatusCellRenderer,
    cellStyle: { width: "100%" },
    editable: true,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: vineyardStatus,
    },
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
    aggFunc: (params: any) => {
      // console.log("LABDATA params", params);
      return params.values;
    },
  },
  {
    field: "tasks",
    minWidth: 124,
    flex: 1,
    cellRenderer: TasksCellRenderer,
    cellStyle: { width: "100%" },
  },
  {
    field: "notes",
    minWidth: 196,
    flex: 1,
    cellRenderer: NotesCellRenderer,
    cellStyle: { width: "100%" },
  },
];
