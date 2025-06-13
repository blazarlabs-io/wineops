import { ColDef } from "ag-grid-community";
import { AvatarCellRenderer } from "./cell-renderers/avatar-cell-renderer";
import { RoleCellRenderer } from "./cell-renderers/role-cell-renderer";

export const columns: ColDef[] = [
  {
    headerName: "Avatar",
    field: "avatar",
    minWidth: 120,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: AvatarCellRenderer,
  },
  {
    headerName: "ID",
    field: "id",
    minWidth: 80,
    flex: 1,
    cellStyle: { width: "100%" },
    //   cellRenderer: CompanyLogoRenderer,
  },
  {
    headerName: "First Name",
    field: "name",
    minWidth: 125,
    flex: 1,
    cellStyle: { width: "100%" },
  },
  {
    headerName: "Last Name",
    field: "lastName",
    flex: 1,
    cellStyle: { width: "100%" },
    //   valueFormatter: dateFormatter,
  },
  {
    headerName: "Email",
    field: "email",
    minWidth: 80,
    flex: 1,
    cellStyle: { width: "100%" },
  },
  {
    headerName: "Role",
    field: "role",
    minWidth: 56,
    flex: 1,
    cellStyle: { width: "100%" },
    cellRenderer: RoleCellRenderer,
  },
];
