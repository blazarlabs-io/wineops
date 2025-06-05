"use client";

import { DataTable } from "@/components/table/data-table";
import { Must } from "@/models/types/db";
import { StrictMode, useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useMust } from "@/context/must";
import { db } from "@/lib/firebase/services";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { mustColumns } from "./columns";

interface MustsTableProps {
  onChangeData?: (data: Must[]) => void;
  openGroupingDialog: boolean;
  handleCloseGroupingDialog: () => void;
  openUngroupingDialog: boolean;
  handleCloseUngroupingDialog: () => void;
}

export default function MustsTable({
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
}: MustsTableProps) {
  const { musts, updateSelectedMusts } = useMust();

  const normalizedMusts = useMemo(
    () =>
      musts.map((must) => ({
        ...must,
        ...(must.rowType !== "group" && {
          metrics: { ...must.metrics, actual: must?.qty, status: must.status },
          mustID: { name: must?.name, grapeVariety: must?.grapeVariety },
          statusData: { status: must?.status, date: must?.date },
        }),
      })),
    [musts]
  );

  const updateGroup = async (uid: string, rows: Partial<Must>[]) =>
    await db.must.updateGroup(uid, rows);

  return (
    <StrictMode>
      <DataTable<Must>
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        data={normalizedMusts}
        columns={mustColumns}
        groupColumnDef={{
          headerName: "Vessel ID",
          rowDrag: true,
          cellRendererParams: {
            innerRenderer: GroupCellRenderer,
            suppressCount: true,
          },
          cellRenderer: "agGroupCellRenderer",
          width: GROUP_COLUMN_WIDTH,
        }}
        updateGroup={updateGroup}
        updateSelectedData={updateSelectedMusts}
      />
    </StrictMode>
  );
}
