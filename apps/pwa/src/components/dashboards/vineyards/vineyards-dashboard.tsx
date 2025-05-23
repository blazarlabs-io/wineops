"use client";

import VineyardsTable from "@/components/table/vineyards";
import ToolsBar from "@/components/widgets/tools-bar";
import { ButtonType } from "@/components/widgets/tools-bar/constants";
import { useSortToolsBarStates } from "@/hooks/use-sort-tools-bar-states";
import { Vineyard } from "@/models/types/db";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function VineyardsDashboard() {
  const [selectionData, setSelectionData] = useState<Vineyard[]>([]);

  const { enableGrouping, enableUngrouping, enableEdit, enableDelete } =
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
        <VineyardsTable
          onChangeData={setSelectionData}
          openGroupingDialog={openGroupingDialog}
          openUngroupingDialog={openUngroupingDialog}
          handleCloseGroupingDialog={handleCloseGroupingDialog}
          handleCloseUngroupingDialog={handleCloseUngroupingDialog}
        />
      </Box>
    </Box>
  );
}
