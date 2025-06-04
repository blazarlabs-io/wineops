"use client";

import { DataTable } from "@/components/table/data-table";
import { Consumable } from "@/models/types/db";
import { StrictMode, useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useConsumable } from "@/context/consumable";
import { db } from "@/lib/firebase/services";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { consumableColumns } from "./columns";

interface ConsumableTableProps {
  onChangeData?: (data: Consumable[]) => void;
  openGroupingDialog: boolean;
  handleCloseGroupingDialog: () => void;
  openUngroupingDialog: boolean;
  handleCloseUngroupingDialog: () => void;
}

export default function ConsumablesTable({
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
}: ConsumableTableProps) {
  const { consumables, updateSelectedConsumables } = useConsumable();

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
          group:
            !consumable?.group ||
            consumable?.group?.length === 0 ||
            (consumable?.group?.length > 0 &&
              consumable.name &&
              consumable.rowType !== "group" &&
              consumable?.group[consumable?.group.length - 1] !==
                consumable.name)
              ? [
                  ...(consumable?.group ?? []).slice(0, -1),
                  ...(consumable?.name ? [consumable?.name] : []),
                ]
              : consumable?.group,
        };
      }),
    [consumables]
  );

  const updateGroup = async (uid: string, rows: Partial<Consumable>[]) =>
    await db.consumable.updateGroup(uid, rows);

  return (
    <StrictMode>
      <DataTable<Consumable>
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
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
        }}
        updateGroup={updateGroup}
        updateSelectedData={updateSelectedConsumables}
      />
    </StrictMode>
  );
}
