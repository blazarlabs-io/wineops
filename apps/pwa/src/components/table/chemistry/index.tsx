"use client";

import { DataTable } from "@/components/table/data-table";
import { Chemistry } from "@/models/types/db";
import { StrictMode, useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useChemistry } from "@/context/chemistry";
import { db } from "@/lib/firebase/services";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { chemistryColumns } from "./columns";

interface ChemistryTableProps {
  onChangeData?: (data: Chemistry[]) => void;
  openGroupingDialog: boolean;
  handleCloseGroupingDialog: () => void;
  openUngroupingDialog: boolean;
  handleCloseUngroupingDialog: () => void;
}

export default function ChemistryTable({
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
}: ChemistryTableProps) {
  const { chemistry, updateSelectedChemistry } = useChemistry();

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
          group:
            !item?.group ||
            item?.group?.length === 0 ||
            (item?.group?.length > 0 &&
              item.name &&
              item.rowType !== "group" &&
              item?.group[item?.group.length - 1] !== item.name)
              ? [
                  ...(item?.group ?? []).slice(0, -1),
                  ...(item?.name ? [item?.name] : []),
                ]
              : item?.group,
        };
      }),
    [chemistry]
  );

  const updateGroup = async (uid: string, rows: Partial<Chemistry>[]) =>
    await db.chemistry.updateGroup(uid, rows);

  return (
    <StrictMode>
      <DataTable<Chemistry>
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
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
        updateGroup={updateGroup}
        updateSelectedData={updateSelectedChemistry}
        groupByButtons={[{ name: "Type", columnName: "type" }]}
      />
    </StrictMode>
  );
}
