"use client";

import { DataTable } from "@/components/table/data-table";
import { useVineyard } from "@/context/vineyard";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { Bottle, Vineyard } from "@/models/types/db";
import { useMemo } from "react";
import { GroupCellRenderer } from "./cell-renderers/group-cell-renderer";
import { columns } from "./columns";
import { wineBottlingDataSample } from "@/data/wine-bottling-data-sample";

export default function WineBottlingTable() {
  const { vineyards = [] } = useVineyard();

  //   const normalizedBottles = useMemo(
  //     () =>
  //       vineyards?.map((vineyard) => ({
  //         ...vineyard,
  //         ...(vineyard.rowType !== "group" && {
  //           forcastedYield: {
  //             status: vineyard?.status || "",
  //           },
  //         }),
  //       })
  //     ),
  //     [vineyards]
  //   );

  const normalizedBottles = useMemo(() => wineBottlingDataSample, []);
  console.log("normalizedBottles", normalizedBottles);
  return (
    <DataTable<Bottle>
      data={normalizedBottles}
      columns={columns}
      groupColumnDef={{
        headerName: "Collection Name & Vintage",
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
