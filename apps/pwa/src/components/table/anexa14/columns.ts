
import { ColDef, ColGroupDef, ValueFormatterParams } from "ag-grid-community";
import { Anexa14Data } from "@/models/types/reports";
import { DefaultCellRenderer } from "./cell-renderers/default-cell-renderer";
import { DateCellRenderer } from "./cell-renderers/date-cell-renderer";
import formatDate from "@/utils/date-format";
import { DEFAULT_LOCALE } from "@/data/constants";
import { UserCellRenderer } from "./cell-renderers/user-cell-renderer";

type MultiCol = Record<keyof Anexa14Data, any>;

export type Anexa14GridData = Anexa14Data & {
  createdByUser: MultiCol;
  modifiedByUser: MultiCol;
};

export const columns: (
  | ColDef<Anexa14GridData, any>
  | ColGroupDef<Anexa14GridData>
)[] = [
  {
    headerName: "Declarant",
    field: "declarant.name",
    minWidth: 100,
    flex: 1,
    cellRenderer: DefaultCellRenderer,
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
