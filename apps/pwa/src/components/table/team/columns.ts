import { ColDef } from "ag-grid-community";
import { AvatarCellRenderer } from "./cell-renderers/avatar-cell-renderer";
import { RoleCellRenderer } from "./cell-renderers/role-cell-renderer";
import { FullNameCellRenderer } from "./cell-renderers/full-name-cell-renderer";
import { DepartmentCellRenderer } from "./cell-renderers/department-cell-renderer";

export const columns: ColDef[] = [
  {
    headerName: "Avatar",
    field: "avatar",
    minWidth: 120,
    flex: 1,
    cellRenderer: AvatarCellRenderer,
  },
  {
    headerName: "Full Name",
    field: "name",
    minWidth: 125,
    flex: 1,
    cellRenderer: FullNameCellRenderer,
  },
  {
    headerName: "Role",
    field: "role",
    minWidth: 56,
    flex: 1,
    cellRenderer: RoleCellRenderer,
  },
  {
    headerName: "Department",
    field: "department",
    flex: 1,
    cellRenderer: DepartmentCellRenderer,
  },
  {
    headerName: "Contact Phone",
    field: "contactPhone",
    minWidth: 80,
    flex: 1,
  },
  {
    headerName: "Email",
    field: "email",
    minWidth: 80,
    flex: 1,
  },
];
