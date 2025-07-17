"use client";

import { DataTable } from "@/components/table/data-table";
import { useBottle } from "@/context/bottle";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { Bottle } from "@/models/types/db";
import { useMemo } from "react";
import { GroupCellRenderer } from "./cell-renderers/group-cell-renderer";
import { columns } from "./columns";

export default function WineBottlingTable() {
  const { bottles } = useBottle();

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

  const normalizedBottles = useMemo(() => bottles, [bottles]);
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
      entityName="bottle"
    />
  );
}
