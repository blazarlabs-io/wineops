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
      musts.flatMap((must) =>
        (must.vessels ?? []).map((vessel) => ({
          ...must,
          ...(must.rowType !== "group" && {
            metrics: {
              ...must.metrics,
              actual: must?.vessels?.reduce((sum, { qty = 0 }) => sum + qty, 0),
              status: must.status,
            },
            statusData: { status: must?.status, date: must?.date },
            mustID: {
              name: must?.name,
              grapeVariety: must?.grapeVariety,
            },
            vesselId: vessel.id,
            vesselType: vessel.type,
            vesselName: vessel.name,
            vesselLocation: vessel.location,
            qty: vessel.qty ?? 0,
            group: [
              ...must?.group.slice(0, -1),
              `${must.name}-${vessel?.name}`,
            ],
          }),
        }))
      ),
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
          headerName: "Must ID",
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
        updateGroup={updateGroup}
        updateSelectedData={updateSelectedMusts}
        groupByButtons={[
          { name: "Vessel Type", columnName: "groupByVesselType" },
          { name: "Location", columnName: "groupByLocation" },
          { name: "Status", columnName: "groupByStatus" },
        ]}
        getRowId={({ data }) => `${data.id}-${data?.vesselId}`}
      />
    </StrictMode>
  );
}
