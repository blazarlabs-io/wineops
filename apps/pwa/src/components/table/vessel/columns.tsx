/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef, ValueFormatterParams } from "ag-grid-enterprise";
import { Vessel } from "@/models/types/db";
import { DefaultCellRenderer } from "../DefaultCellRenderer";
import formatDate from "@/utils/date-format";
import { CurrentBatchCellRenderer } from "./CurrentBatchCellRenderer";
import { VesselIDCellRenderer } from "./VesselIDCellRenderer";
import { VesselUsageCellRenderer } from "./VesselUsageCellRenderer";
import { VolumeCellRenderer } from "./VolumeCellRenderer";
import { DEFAULT_LOCALE } from "@/data/constants";

type MultiCol = Record<keyof Vessel, any>;

export const vesselColumns: ColDef<
  Vessel & {
    vesselId: MultiCol;
    currentBatch: MultiCol;
    volumeData: MultiCol;
    vesselUsage: MultiCol;
  },
  any
>[] = [
  {
    headerName: "Vessel ID",
    field: "vesselId",
    minWidth: 150,
    flex: 1,
    editable: false,
    cellRenderer: VesselIDCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Last Maintenance",
    field: "lastMaintenance",
    minWidth: 150,
    flex: 1,
    editable: false,
    aggFunc: (params) => params.values,
    valueFormatter: ({ value, data, node }: ValueFormatterParams) => {
      const isGroup = node?.group || data?.rowType === "group";

      return value && !isGroup
        ? formatDate(value, { locale: DEFAULT_LOCALE })
        : "";
    },
  },
  {
    headerName: "Vessel Location",
    field: "location",
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: DefaultCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Current Usage/Batch",
    field: "currentBatch",
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: CurrentBatchCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Volume",
    field: "volumeData",
    minWidth: 100,
    flex: 1,
    editable: false,
    cellRenderer: VolumeCellRenderer,
    aggFunc: (params) => params.values,
  },
  {
    headerName: "Vessel Usage",
    field: "vesselUsage",
    minWidth: 200,
    flex: 1,
    editable: false,
    cellRenderer: VesselUsageCellRenderer,
    aggFunc: (params) => params.values,
  },
];
