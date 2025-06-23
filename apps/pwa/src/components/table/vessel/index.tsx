"use client";

import { DataTable } from "@/components/table/data-table";
import { Vessel } from "@/models/types/db";
import { useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useVessel } from "@/context/vessel";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { vesselColumns } from "./columns";

export default function VesselTable() {
  const { vessels } = useVessel();

  const normalizedVessels = useMemo(
    () =>
      vessels.map((vessel) => ({
        ...vessel,
        ...(vessel.rowType !== "group" && {
          vesselId: {
            name: vessel?.name,
            type: vessel?.type,
          },
          volumeData: {
            volume: vessel?.volume,
            volumeUnit: vessel?.volumeUnit,
          },
          vesselUsage: {
            type: vessel?.type,
            usage: vessel?.usage,
            barrelInfo: vessel?.barrelInfo,
            sstInfo: vessel?.sstInfo,
          },
        }),
        currentBatch: {
          currentUsage: vessel?.currentUsage,
          startDate: vessel?.startDate,
        },
        group:
          !vessel?.group ||
          vessel?.group?.length === 0 ||
          (vessel?.group?.length > 0 &&
            vessel.name &&
            vessel.rowType !== "group" &&
            vessel?.group[vessel?.group.length - 1] !== vessel.name)
            ? [
                ...(vessel?.group ?? []).slice(0, -1),
                ...(vessel?.name ? [vessel?.name] : []),
              ]
            : vessel?.group,
      })),
    [vessels]
  );

  return (
    <DataTable<Vessel>
      data={normalizedVessels}
      columns={vesselColumns}
      groupColumnDef={{
        headerName: "Vessel Type",
        rowDrag: true,
        cellRendererParams: {
          innerRenderer: GroupCellRenderer,
          suppressCount: true,
        },
        cellRenderer: "agGroupCellRenderer",
        width: GROUP_COLUMN_WIDTH,
        lockPinned: true,
        lockPosition: true,
        suppressMovable: true,
      }}
      entityName="vessel"
    />
  );
}
