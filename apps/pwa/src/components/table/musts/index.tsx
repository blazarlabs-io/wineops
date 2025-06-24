"use client";

import { DataTable } from "@/components/table/data-table";
import { Must, MustWineVessel } from "@/models/types/db";
import { useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useMust } from "@/context/must";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { mustColumns } from "./columns";

export default function MustsTable() {
  const { musts } = useMust();

  const normalizedMusts = useMemo(
    () =>
      musts.flatMap((must) =>
        (must.vessels ?? [{} as MustWineVessel]).map((vessel) => ({
          ...must,
          ...(must.rowType !== "group" && {
            metrics: {
              ...must.metrics,
              actual: must?.vessels?.reduce((sum, { qty = 0 }) => sum + qty, 0),
              status: must.status,
            },
            statusData: { status: must?.status, date: must?.date },
            mustID: {
              name: must?.name,
              grapeVariety: must?.grapeVariety,
            },
            vesselId: vessel.id,
            vesselType: vessel.type,
            vesselName: vessel.name,
            vesselLocation: vessel.location,
            qty: vessel.qty ?? 0,
            group: [
              ...must?.group.slice(0, -1),
              `${must.name}-${vessel?.name}`,
            ],
          }),
        }))
      ),
    [musts]
  );

  return (
    <DataTable<Must>
      data={normalizedMusts}
      columns={mustColumns}
      groupColumnDef={{
        headerName: "Must ID",
        rowDrag: true,
        minWidth: 200,
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
      groupByButtons={[
        { name: "Vessel Type", columnName: "groupByVesselType" },
        { name: "Location", columnName: "groupByLocation" },
        { name: "Status", columnName: "groupByStatus" },
      ]}
      getRowId={({ data }) => `${data.id}-${data?.vesselId}`}
      entityName="must"
    />
  );
}
