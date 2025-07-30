import { ColDef } from "ag-grid-community";
import { TitleCellRenderer } from "./cell-renderers/title-cell-renderer";
import { StatusCellRenderer } from "./cell-renderers/status-cell-renderer";
import { DateCellRenderer } from "./cell-renderers/date-cell-renderer";
import { CreatedByCellRenderer } from "./cell-renderers/created-by-cell-renderer";
import PriorityDataDisplay from "@/components/data-display/priority-data-display";
import { PriorityCellRenderer } from "./cell-renderers/priority-cell-renderer";

export const columns: ColDef[] = [
  {
    headerName: "Title",
    field: "title",
    minWidth: 120,
    flex: 1,
    cellRenderer: TitleCellRenderer,
  },
  {
    headerName: "Status",
    field: "status",
    minWidth: 125,
    flex: 1,
    cellRenderer: StatusCellRenderer,
  },
  {
    headerName: "Object",
    field: "subjectOfAction",
    minWidth: 56,
    flex: 1,
  },
  {
    headerName: "Priority",
    field: "priority",
    flex: 1,
    cellRenderer: PriorityCellRenderer,
  },
  {
    headerName: "Start Date",
    field: "startDate",
    minWidth: 80,
    flex: 1,
    cellRenderer: DateCellRenderer,
  },
  {
    headerName: "Due Date",
    field: "dueDate",
    minWidth: 80,
    flex: 1,
    cellRenderer: DateCellRenderer,
  },
  {
    headerName: "Created By",
    field: "createdBy",
    minWidth: 80,
    flex: 1,
    cellRenderer: CreatedByCellRenderer,
  },
];
