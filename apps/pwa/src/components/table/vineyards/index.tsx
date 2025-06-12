"use client";

import { DataTable } from "@/components/table/data-table";
import { useVineyard } from "@/context/vineyard";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import { db } from "@/lib/firebase/services";
import { Vineyard } from "@/models/types/db";
import { StrictMode, useMemo } from "react";
import { GroupCellRenderer } from "./cell-renderers/group-cell-renderer";
import { vineyardColumns } from "./columns";

interface VineyardTableProps {
  onChangeData?: (data: Vineyard[]) => void;
  openGroupingDialog: boolean;
  handleCloseGroupingDialog: () => void;
  openUngroupingDialog: boolean;
  handleCloseUngroupingDialog: () => void;
}

export default function VineyardsTable({
  onChangeData,
  openGroupingDialog,
  handleCloseGroupingDialog,
  openUngroupingDialog,
  handleCloseUngroupingDialog,
}: VineyardTableProps) {
  const { vineyards, updateSelectedVineyards } = useVineyard();

  // const normalizedVineyards = useMemo(
  //   () =>
  //     vineyards.map((vineyard: Vineyard) => ({
  //       ...vineyard,
  //     })),
  //   [vineyards]
  // );

  const normalizedVineyards = useMemo(
    () =>
      vineyards.map((vineyard) => ({
        ...vineyard,
        ...(vineyard.rowType !== "group" && {}),
        group:
          !vineyard?.group ||
          vineyard?.group?.length === 0 ||
          (vineyard?.group?.length > 0 &&
            vineyard.name &&
            vineyard.rowType !== "group" &&
            vineyard?.group[vineyard?.group.length - 1] !== vineyard.name)
            ? [...vineyard?.group.slice(0, -1), vineyard?.name]
            : vineyard?.group,
      })),
    [vineyards]
  );

  const updateGroup = async (uid: string, rows: Partial<Vineyard>[]) =>
    await db.vineyard.updateGroup(uid, rows);

  return (
    <StrictMode>
      <DataTable<Vineyard>
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        data={normalizedVineyards}
        columns={vineyardColumns}
        groupColumnDef={{
          headerName: "Name",
          rowDrag: true,
          cellRendererParams: {
            innerRenderer: GroupCellRenderer,
            suppressCount: true,
          },
          cellRenderer: "agGroupCellRenderer",
          width: GROUP_COLUMN_WIDTH,
        }}
        updateGroup={updateGroup}
        updateSelectedData={updateSelectedVineyards}
      />
    </StrictMode>
  );
}
