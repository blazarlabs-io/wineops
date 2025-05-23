"use client";

import { useColorScheme } from "@mui/material";
import { DataTable } from "@/components/table/data-table";
import { Grape, Vineyard } from "@/models/types/db";
import { StrictMode, useMemo } from "react";
import { vineyardColumns } from "./columns";
import { GroupCellRenderer } from "./cell-renderers/group-cell-renderer";
import { db } from "@/lib/firebase/services";
import { SelectionCellRenderer } from "./cell-renderers/SelectionCellRenderer";
import { useVineyard } from "@/context/vineyard";
import { getData } from "./data";
import { GROUP_COLUMN_WIDTH } from "@/data/constants";
import "./style.css";

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
  const { mode } = useColorScheme();
  const { vineyards, updateSelectedVineyards } = useVineyard();

  const normalizedVineyards = useMemo(
    () =>
      getData().map((vineyard) => ({
        ...vineyard,
      })),
    []
  );

  const updateGroup = async (
    uid: string,
    rows: Partial<Vineyard>[],
    group: string[]
  ) => await db.vineyard.updateGroup(uid, rows, group);

  return (
    <StrictMode>
      <DataTable<Vineyard>
        isDarkMode={mode === "dark"}
        onChangeData={onChangeData}
        openGroupingDialog={openGroupingDialog}
        openUngroupingDialog={openUngroupingDialog}
        handleCloseGroupingDialog={handleCloseGroupingDialog}
        handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        data={normalizedVineyards}
        columns={vineyardColumns}
        selectionCellRenderer={SelectionCellRenderer}
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
