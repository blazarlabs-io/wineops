"use client";

import { DataTable } from "@/components/table/data-table";
import { Bulk } from "@/models/types/db";
import { StrictMode, useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useBulk } from "@/context/bulk";
import { db } from "@/lib/firebase/services";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { bulkColumns } from "./columns";

interface BulkTableProps {
  onChangeData?: (data: Bulk[]) => void;
  openGroupingDialog: boolean;
  handleCloseGroupingDialog: () => void;
  openUngroupingDialog: boolean;
  handleCloseUngroupingDialog: () => void;
}

export default function BulksTable({
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
}: BulkTableProps) {
  const { bulks, updateSelectedBulks } = useBulk();

  const normalizedBulks = useMemo(
    () =>
      bulks.map((bulk) => ({
        ...bulk,
        ...(bulk.rowType !== "group" && {
          statusData: { status: bulk?.status, date: bulk?.startDate },
        }),
        group:
          !bulk?.group ||
          bulk?.group?.length === 0 ||
          (bulk?.group?.length > 0 &&
            bulk.name &&
            bulk.rowType !== "group" &&
            bulk?.group[bulk?.group.length - 1] !== bulk.name)
            ? [
                ...(bulk?.group ?? []).slice(0, -1),
                ...(bulk?.name ? [bulk?.name] : []),
              ]
            : bulk?.group,
      })),
    [bulks]
  );

  const updateGroup = async (uid: string, rows: Partial<Bulk>[]) =>
    await db.bulk.updateGroup(uid, rows);

  return (
    <StrictMode>
      <DataTable<Bulk>
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        data={normalizedBulks}
        columns={bulkColumns}
        groupColumnDef={{
          headerName: "Wine name",
          rowDrag: true,
          cellRendererParams: {
            innerRenderer: GroupCellRenderer,
            suppressCount: true,
          },
          cellRenderer: "agGroupCellRenderer",
          width: GROUP_COLUMN_WIDTH,
        }}
        updateGroup={updateGroup}
        updateSelectedData={updateSelectedBulks}
        groupByButtons={[{ name: "Status", columnName: "groupByStatus" }]}
      />
    </StrictMode>
  );
}
