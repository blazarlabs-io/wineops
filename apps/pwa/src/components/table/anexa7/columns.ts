
import { ColDef, ColGroupDef, ValueFormatterParams } from "ag-grid-community";
import { Anexa7Data } from "@/models/types/reports";
import { DateCellRenderer } from "./cell-renderers/date-cell-renderer";
import formatDate from "@/utils/date-format";
import { DEFAULT_LOCALE } from "@/data/constants";
import { UserCellRenderer } from "./cell-renderers/user-cell-renderer";
import { DeclarantCellRenderer } from "./cell-renderers/declarant-cell-renderer";

type MultiCol = Record<keyof Anexa7Data, any>;

export type Anexa7GridData = Anexa7Data & {
  createdByUser: MultiCol;
  modifiedByUser: MultiCol;
};

export const columns: (
  | ColDef<Anexa7GridData, any>
  | ColGroupDef<Anexa7GridData>
)[] = [
  {
    headerName: "Declarant",
    field: "declarant",
    minWidth: 100,
    flex: 1,
    cellRenderer: DeclarantCellRenderer,
  },
  {
    headerName: "Date",
    field: "date",
    minWidth: 100,
    flex: 1,
    valueFormatter: ({ value }: ValueFormatterParams) =>
      formatDate(value, { locale: DEFAULT_LOCALE }),
  },
  {
    headerName: "Created By",
    field: "createdByUser",
    minWidth: 100,
    flex: 1,
    cellRenderer: UserCellRenderer,
  },
  {
    headerName: "Created date",
    field: "createdAt",
    minWidth: 100,
    flex: 1,
    cellRenderer: DateCellRenderer,
  },
  {
    headerName: "Modified By",
    field: "modifiedByUser",
    minWidth: 100,
    flex: 1,
    cellRenderer: UserCellRenderer,
  },
  {
    headerName: "Modified date",
    field: "modifiedAt",
    minWidth: 100,
    flex: 1,
    cellRenderer: DateCellRenderer,
  },
];
