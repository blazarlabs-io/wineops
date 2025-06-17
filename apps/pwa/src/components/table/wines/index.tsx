"use client";

import { DataTable } from "@/components/table/data-table";
import { Wine } from "@/models/types/db";
import { StrictMode, useMemo } from "react";
import { GroupCellRenderer } from "./GroupCellRenderer";
import { useWine } from "@/context/wine";
import { db } from "@/lib/firebase/services";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { wineColumns } from "./columns";

interface WineTableProps {
  onChangeData?: (data: Wine[]) => void;
  openGroupingDialog: boolean;
  handleCloseGroupingDialog: () => void;
  openUngroupingDialog: boolean;
  handleCloseUngroupingDialog: () => void;
}

export default function WinesTable({
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
}: WineTableProps) {
  const { wines, updateSelectedWines } = useWine();

  const normalizedWines = useMemo(
    () =>
      wines.flatMap((wine) =>
        (wine.vessels ?? []).map((vessel) => ({
          ...wine,
          ...(wine.rowType !== "group" && {
            metrics: {
              ...wine.metrics,
              actual: wine?.vessels?.reduce((sum, { qty = 0 }) => sum + qty, 0),
              status: wine.status,
            },
            statusData: { status: wine?.status, date: wine?.date },
            wineName: {
              name: wine?.name,
              grapeVariety: wine?.grapeVariety,
            },
            vesselId: vessel.id,
            vesselType: vessel.type,
            vesselName: vessel.name,
            vesselLocation: vessel.location,
            qty: vessel.qty ?? 0,
            group: [
              ...wine?.group.slice(0, -1),
              `${wine.name}-${vessel?.name}`,
            ],
          }),
        }))
      ),
    [wines]
  );

  const updateGroup = async (uid: string, rows: Partial<Wine>[]) =>
    await db.wine.updateGroup(uid, rows);

  return (
    <StrictMode>
      <DataTable<Wine>
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        data={normalizedWines}
        columns={wineColumns}
        groupColumnDef={{
          headerName: "Wine Name",
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
        updateSelectedData={updateSelectedWines}
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
