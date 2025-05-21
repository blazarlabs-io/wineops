"use client";

import { DataTable } from "@/components/table/data-table";
import ToolsBar from "@/components/widgets/tools-bar";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { Vineyard } from "@/models/types/db";
import { Box, Typography, useColorScheme } from "@mui/material";
import { StrictMode, useState } from "react";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { useVineyard } from "@/context/vineyard";
import { vineyardColumns } from "@/components/table/data-table/columns";
import { GroupCellRenderer } from "@/components/table/data-table/cell-renderers/GroupCellRenderer";
import { db } from "@/lib/firebase/services";
import { SelectionCellRenderer } from "@/components/table/data-table/cell-renderers/SelectionCellRenderer";

export default function VineyardsDashboard() {
  const { mode } = useColorScheme();

  const [selectionData, setSelectionData] = useState<Vineyard[]>([]);

  const { enableEdit, enableGrouping, enableDelete, enableUngrouping } =
    useSortToolsBarStates(selectionData);

  const [openGroupingDialog, setOpenGroupingDialog] = useState(false);
  const [openUngroupingDialog, setOpenUngroupingDialog] = useState(false);

  const handleClickOpenGroupingDialog = () => {
    setOpenGroupingDialog(true);
  };

  const handleCloseGroupingDialog = () => {
    setOpenGroupingDialog(false);
  };

  const handleClickOpenUngroupingDialog = () => {
    setOpenUngroupingDialog(true);
  };

  const handleCloseUngroupingDialog = () => {
    setOpenUngroupingDialog(false);
  };

  const { vineyards, updateSelectedVineyards } = useVineyard();

  const updateGroup = async (
    uid: string,
    rows: Partial<Vineyard>[],
    group: string[]
  ) => await db.vineyard.updateGroup(uid, rows, group);

  return (
    <Box className="flex w-full h-full">
      <Box className="flex flex-col gap-4 w-full">
        <Typography variant="h4">Vineyards Management</Typography>
        <ToolsBar
          buttons={{
            [ButtonType.ADD]: {
              enabled: true,
            },
            [ButtonType.EDIT]: {
              enabled: enableEdit,
            },
            [ButtonType.DELETE]: {
              enabled: enableDelete,
            },
            [ButtonType.GROUP]: {
              enabled: enableGrouping,
              onClick: handleClickOpenGroupingDialog,
            },
            [ButtonType.UNGROUP]: {
              enabled: enableUngrouping,
              onClick: handleClickOpenUngroupingDialog,
            },
          }}
        />
        <StrictMode>
          <DataTable<Vineyard>
            isDarkMode={mode === "dark"}
            onChangeData={setSelectionData}
            openGroupingDialog={openGroupingDialog}
            openUngroupingDialog={openUngroupingDialog}
            handleCloseGroupingDialog={handleCloseGroupingDialog}
            handleCloseUngroupingDialog={handleCloseUngroupingDialog}
            data={vineyards}
            columns={vineyardColumns}
            selectionCellRenderer={SelectionCellRenderer}
            groupColumnDef={{
              headerName: "Name",
              cellRendererParams: {
                innerRenderer: GroupCellRenderer,
                suppressCount: true,
              },
            }}
            updateGroup={updateGroup}
            updateSelectedData={updateSelectedVineyards}
          />
        </StrictMode>
      </Box>
    </Box>
  );
}
