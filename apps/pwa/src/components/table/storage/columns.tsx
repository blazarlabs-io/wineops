import { ColDef, ColGroupDef } from "ag-grid-enterprise";
import { Must, MustWineVessel, Vessel } from "@/models/types/db";
import { VesselIDCellRenderer } from "./VesselIDCellRenderer";
import { NotesCellRenderer } from "../NotesCellRenderer";
import { TasksCellRenderer } from "../tasks-cell-renderer";
import { QtyCellRenderer } from "./QtyCellRenderer";
import { ActionRelation } from "@/models/types/actions";
import { DateCellRenderer } from "./date-cell-renderer";

type MultiCol = Record<keyof Must, any>;
type Data = Must & {
  statusData: MultiCol;
  groupByMustName: Vessel["name"];
  groupByVesselType: Vessel["type"];
  groupByLocation: Vessel["location"];
  mustID: MultiCol;
  vessel: Partial<Data>;
  vesselId: Vessel["id"];
  vesselType: Vessel["type"];
  vesselLocation: Vessel["location"];
  vesselQty: MustWineVessel["qty"];
  storageDate: ActionRelation["date"];
  groupByWineName: Vessel["name"];
  field?: any;
};

export const storageColumns: (ColDef<Data, any> | ColGroupDef<Data>)[] = [
  {
    headerName: "Vessel ID",
    field: "vessel",
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
    headerName: "Group: Must Name",
    field: "groupByMustName",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: ({ data }) => data?.name,
    keyCreator: (params) => params?.value,
  },
  {
    headerName: "Group: Wine Name",
    field: "groupByWineName",
    hide: true,
    enableRowGroup: true,
    rowGroup: false,
    valueGetter: ({ data }) => data?.name,
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
    headerName: "Quantity Overview",
    field: "vesselQty",
    minWidth: 170,
    flex: 1,
    editable: false,
    cellRenderer: QtyCellRenderer,
  },
  {
    headerName: "Tasks",
    field: "tasks",
    minWidth: 150,
    flex: 1,
    cellRenderer: TasksCellRenderer,
  },
  {
    headerName: "Start Date",
    field: "storageDate",
    minWidth: 100,
    flex: 1,
    cellRenderer: DateCellRenderer,
  },
  {
    headerName: "Notes",
    field: "notes",
    minWidth: 150,
    flex: 1,
    cellRenderer: NotesCellRenderer,
  },
];
