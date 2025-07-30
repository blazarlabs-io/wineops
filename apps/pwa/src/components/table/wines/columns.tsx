import { ColDef, ColGroupDef } from "ag-grid-enterprise";
import { Vessel, Wine } from "@/models/types/db";
import { DefaultCellRenderer } from "../DefaultCellRenderer";
import { StatusCellRenderer } from "./StatusCellRenderer";
import { LabDataCellRenderer } from "./LabDataCellRenderer";
import { TasksCellRenderer } from "../tasks-cell-renderer";
import { NotesCellRenderer } from "../NotesCellRenderer";
import { VesselIDCellRenderer } from "./VesselIDCellRenderer";

type MultiCol = Record<keyof Wine, any>;
type Data = Wine & {
  statusData: MultiCol;
  groupByStatus: Wine["status"];
  groupByVesselType: Vessel["type"];
  groupByLocation: Vessel["location"];
  vesselId: Vessel["id"];
  vesselType: Vessel["type"];
  vesselLocation: Vessel["location"];
};

export const wineColumns: (ColDef<Data, any> | ColGroupDef<Data>)[] = [
  {
    headerName: "Vessel ID",
    field: "vesselId",
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: VesselIDCellRenderer,
  },
  {
    headerName: "Group: Vessel Type",
    field: "groupByVesselType",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: ({ data }) => data?.vesselType,
    keyCreator: (params) => params?.value,
  },
  {
    headerName: "Group: Location",
    field: "groupByLocation",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: ({ data }) => data?.vesselLocation,
    keyCreator: (params) => params?.value,
  },
  {
    headerName: "Status",
    field: "statusData",
    minWidth: 150,
    flex: 1,
    editable: false,
    cellRenderer: StatusCellRenderer,
    cellRendererParams: {
      alignItems: "center",
    },
    enableRowGroup: true,
  },
  {
    headerName: "Group: Status",
    field: "groupByStatus",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: (params) => params.data?.statusData?.status,
    keyCreator: (params) => params?.value,
  },
  {
    headerName: "Wine Qty (tonns)",
    field: "qty",
    minWidth: 160,
    flex: 1,
    editable: false,
    cellRenderer: DefaultCellRenderer,
    cellRendererParams: {
      aggField: "qty",
      alignItems: "flex-end",
      shouldAggregate: true,
    },
  },
  {
    headerName: "Lab Data",
    field: "labData",
    minWidth: 250,
    flex: 1,
    cellRenderer: LabDataCellRenderer,
  },
  {
    headerName: "Tasks",
    field: "tasks",
    minWidth: 150,
    flex: 1,
    cellRenderer: TasksCellRenderer,
  },
  {
    headerName: "Notes",
    field: "notes",
    minWidth: 150,
    flex: 1,
    cellRenderer: NotesCellRenderer,
  },
];
