import { vineyardStatus } from '@/data/system-variables';
import { ColDef } from 'ag-grid-enterprise';
import { GrapeVarietyCellRenderer } from './cell-renderers/GrapeVarietyCellRenderer';
import { LabDataCellRenderer } from './cell-renderers/LabDataCellRenderer';
import { NotesCellRenderer } from './cell-renderers/NotesCellRenderer';
import { QuantityCellRenderer } from './cell-renderers/QuantityCellRenderer';
import { StatusCellRenderer } from './cell-renderers/StatusCellRenderer';
import { TasksCellRenderer } from './cell-renderers/TasksCellRenderer';

export const employeeColumns: ColDef[] = [
  // {
  //   field: 'name',
  //   minWidth: 124,
  //   flex: 1,
  //   cellStyle: { width: '100%' },
  //   editable: true,
  //   cellEditor: 'agRichTextCellEditor',
  // },
  {
    field: 'grapeVariety',
    minWidth: 164,
    flex: 1,
    cellRenderer: GrapeVarietyCellRenderer,
    cellStyle: { width: '100%' },
    editable: true,
    cellEditor: 'agRichTextCellEditor',
  },
  {
    field: 'status',
    // width: 148,
    minWidth: 148,
    flex: 1,
    cellRenderer: StatusCellRenderer,
    cellStyle: { width: '100%' },
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      values: vineyardStatus,
    },
  },
  {
    field: 'forcastedYield',
    // width: 240,
    minWidth: 240,
    flex: 1,
    cellRenderer: QuantityCellRenderer,
    cellStyle: { width: '100%' },
  },
  {
    field: 'labData',
    // width: 196,
    minWidth: 196,
    flex: 1,
    cellRenderer: LabDataCellRenderer,
    cellStyle: { width: '100%' },
  },
  {
    field: 'tasks',
    // width: 124,
    minWidth: 124,
    flex: 1,
    cellRenderer: TasksCellRenderer,
    cellStyle: { width: '100%' },
  },
  {
    field: 'notes',
    // width: 250,
    minWidth: 196,
    flex: 1,
    cellRenderer: NotesCellRenderer,
    cellStyle: { width: '100%' },
  },
];
