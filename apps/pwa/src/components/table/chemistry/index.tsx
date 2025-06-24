"use client";

import { DataTable } from "@/components/table/data-table";
import { Chemistry } from "@/models/types/db";
import { useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useChemistry } from "@/context/chemistry";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { chemistryColumns } from "./columns";

export default function ChemistryTable() {
  const { chemistry } = useChemistry();

  const normalizedChemistry = useMemo(
    () =>
      chemistry.map((item) => {
        const reversedUsage = (item.usage || [])?.slice().reverse();

        return {
          ...item,
          ...(item.rowType !== "group" && {
            inUseToday: reversedUsage.find(({ inUseToday }) => inUseToday)
              ?.inUseToday,
            inUseThisWeek: reversedUsage.find(
              ({ inUseThisWeek }) => inUseThisWeek
            )?.inUseThisWeek,
          }),
        };
      }),
    [chemistry]
  );

  return (
    <DataTable<Chemistry>
      data={normalizedChemistry}
      columns={chemistryColumns}
      groupColumnDef={{
        headerName: "Common Chemistry Name",
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
      groupByButtons={[{ name: "Type", columnName: "type" }]}
      entityName="chemistry"
    />
  );
}
