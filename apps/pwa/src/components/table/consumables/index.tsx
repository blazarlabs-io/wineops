"use client";

import { DataTable } from "@/components/table/data-table";
import { Consumable } from "@/models/types/db";
import { useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useConsumable } from "@/context/consumable";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { consumableColumns } from "./columns";

export default function ConsumablesTable() {
  const { consumables } = useConsumable();

  const normalizedConsumables = useMemo(
    () =>
      consumables.map((consumable) => {
        const reversedUsage = (consumable.usage || [])?.slice().reverse();

        return {
          ...consumable,
          ...(consumable.rowType !== "group" && {
            inUseToday: reversedUsage.find(({ inUseToday }) => inUseToday)
              ?.inUseToday,
            inUseThisWeek: reversedUsage.find(
              ({ inUseThisWeek }) => inUseThisWeek
            )?.inUseThisWeek,
          }),
        };
      }),
    [consumables]
  );

  return (
    <DataTable<Consumable>
      data={normalizedConsumables}
      columns={consumableColumns}
      groupColumnDef={{
        headerName: "Category",
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
      entityName="consumable"
    />
  );
}
