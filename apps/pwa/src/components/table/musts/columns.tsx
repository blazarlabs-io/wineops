/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef, ColGroupDef } from "ag-grid-enterprise";
import { Must, Vessel } from "@/models/types/db";
import { VesselIDCellRenderer } from "./VesselIDCellRenderer";
import { QuantityCellRenderer } from "../QuantityCellRenderer";
import { LabDataCellRenderer } from "./LabDataCellRenderer";
import { NotesCellRenderer } from "../NotesCellRenderer";
import { StatusCellRenderer } from "./StatusCellRenderer";
import { TasksCellRenderer } from "../tasks-cell-renderer";
import { MustIDCellRenderer } from "./MustIDCellRenderer";

type MultiCol = Record<keyof Must, any>;
type Data = Must & {
  statusData: MultiCol;
  groupByStatus: Must["status"];
  groupByDate: Must["date"];
  groupByVesselType: Vessel["type"];
  groupByLocation: Vessel["location"];
  mustID: MultiCol;
  vesselId: Vessel["id"];
  vesselType: Vessel["type"];
  vesselLocation: Vessel["location"];
};

export const mustColumns: (ColDef<Data, any> | ColGroupDef<Data>)[] = [
  {
    headerName: "Vessel ID",
    field: "vesselId",
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: VesselIDCellRenderer,
  },
  {
    headerName: "Must ID",
    field: "mustID",
    hide: true,
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: MustIDCellRenderer,
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
    minWidth: 100,
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
    headerName: "Quantity",
    field: "metrics",
    minWidth: 240,
    flex: 1,
    editable: false,
    cellRenderer: QuantityCellRenderer,
  },
  {
    headerName: "Labs",
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
