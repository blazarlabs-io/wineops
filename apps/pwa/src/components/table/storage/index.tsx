"use client";

import { DataTable } from "@/components/table/data-table";
import { useMust } from "@/context/must";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import {
  MustStatus,
  MustWineVessel,
  MustWithVessel,
  WineStatus,
  WineWithVessel,
} from "@/models/types/db";
import { useMemo } from "react";
import { storageColumns } from "./columns";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useVessel } from "@/context/vessel";
import { useWine } from "@/context/wine";

export default function StorageTable({ storageType }: { storageType: number }) {
  const { musts } = useMust();
  const { wines } = useWine();

  const { vessels } = useVessel();

  const filteredEntities = useMemo(
    () =>
      (storageType === 1 ? wines : musts).filter(
        ({ status, vessels }) =>
          status ===
            (storageType === 1 ? WineStatus.STORED : MustStatus.STORED) &&
          !!vessels &&
          Array.isArray(vessels) &&
          vessels.length > 0
      ),
    [musts, storageType, wines]
  );

  const normalizedEntities = useMemo(
    () =>
      filteredEntities.flatMap((entity) =>
        (entity.vessels ?? [{} as MustWineVessel]).map(({ id, qty }) => {
          const vessel = vessels.find((vessel) => vessel.id === id)!;

          return {
            ...entity,
            ...(entity.rowType !== "group" && {
              metrics: {
                ...entity.metrics,
                actual: entity?.vessels?.reduce(
                  (sum, { qty = 0 }) => sum + qty,
                  0
                ),
                status: entity.status,
              },
              statusData: { status: entity?.status, date: entity?.date },
              mustID: {
                name: entity?.name,
                grapeVariety: entity?.grapeVariety,
              },
              vesselId: vessel?.id,
              vesselType: vessel?.type,
              vesselName: vessel?.name,
              vesselLocation: vessel?.location,
              vesselQty: qty ?? 0,
              group: [
                ...(entity?.group as string[])?.slice(0, -1),
                `${entity.name}-${vessel?.name}`,
              ],
              storageDate: entity?.actions?.[0]?.date,
            }),
          };
        })
      ),
    [filteredEntities, vessels]
  );

  return (
    <DataTable<MustWithVessel | WineWithVessel>
      data={normalizedEntities}
      columns={storageColumns}
      groupColumnDef={{
        headerName: "Current Usage/Batch",
        rowDrag: true,
        minWidth: 200,
        cellRendererParams: {
          innerRenderer: GroupCellRenderer,
          suppressCount: true,
          storageType,
        },
        cellRenderer: "agGroupCellRenderer",
        width: GROUP_COLUMN_WIDTH,
        lockPinned: true,
        lockPosition: true,
        suppressMovable: true,
      }}
      getRowId={({ data }) => `${data.id}-${data?.vesselId}-${data?.group}`}
      entityName={storageType === 1 ? "wine" : "must"}
      {...(normalizedEntities.length > 0 && {
        defaultGroupedBy: "groupByLocation",
      })}
    />
  );
}
