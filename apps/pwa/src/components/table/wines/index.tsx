"use client";

import { DataTable } from "@/components/table/data-table";
import { MustWineVessel, Wine } from "@/models/types/db";
import { useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useWine } from "@/context/wine";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { wineColumns } from "./columns";

export default function WinesTable() {
  const { wines } = useWine();

  const normalizedWines = useMemo(
    () =>
      wines.flatMap((wine) =>
        (wine.vessels ?? [{} as MustWineVessel]).map((vessel) => ({
          ...wine,
          ...(wine.rowType !== "group" && {
            metrics: {
              ...wine.metrics,
              actual: wine?.vessels?.reduce((sum, { qty = 0 }) => sum + qty, 0),
              status: wine.status,
            },
            statusData: { status: wine?.status, date: wine?.date },
            wineName: {
              name: wine?.name,
              grapeVariety: wine?.grapeVariety,
            },
            vesselId: vessel.id,
            vesselType: vessel.type,
            vesselName: vessel.name,
            vesselLocation: vessel.location,
            qty: vessel.qty ?? 0,
            group: [
              ...(wine?.group as string[]).slice(0, -1),
              `${wine.name}-${vessel?.name}`,
            ],
          }),
        }))
      ),
    [wines]
  );

  return (
    <DataTable<Wine>
      data={normalizedWines}
      columns={wineColumns}
      groupColumnDef={{
        headerName: "Wine Name",
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
      getRowId={({ data }) => `${data.id}-${data?.vesselId}`}
      entityName="wine"
    />
  );
}
