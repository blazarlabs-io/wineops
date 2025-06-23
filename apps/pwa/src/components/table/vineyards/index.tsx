"use client";

import { DataTable } from "@/components/table/data-table";
import { useVineyard } from "@/context/vineyard";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { Vineyard } from "@/models/types/db";
import { useMemo } from "react";
import { GroupCellRenderer } from "./cell-renderers/group-cell-renderer";
import { vineyardColumns } from "./columns";

export default function VineyardsTable() {
  const { vineyards } = useVineyard();

  // const normalizedVineyards = useMemo(
  //   () =>
  //     vineyards.map((vineyard: Vineyard) => ({
  //       ...vineyard,
  //     })),
  //   [vineyards]
  // );

  const normalizedVineyards = useMemo(
    () =>
      vineyards.map((vineyard) => ({
        ...vineyard,
        ...(vineyard.rowType !== "group" && {}),
        group:
          !vineyard?.group ||
          vineyard?.group?.length === 0 ||
          (vineyard?.group?.length > 0 &&
            vineyard.name &&
            vineyard.rowType !== "group" &&
            vineyard?.group[vineyard?.group.length - 1] !== vineyard.name)
            ? [...vineyard?.group.slice(0, -1), vineyard?.name]
            : vineyard?.group,
      })),
    [vineyards]
  );

  return (
    <DataTable<Vineyard>
      data={normalizedVineyards}
      columns={vineyardColumns}
      groupColumnDef={{
        headerName: "Name",
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
      entityName="vineyard"
    />
  );
}
